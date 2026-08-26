require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'troque-esta-chave';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cria as tabelas automaticamente caso ainda não existam (idempotente)
async function ensureSchema() {
  const fs = require('fs');
  const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  await pool.query(schema);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM categories');
  if (rows[0].total === 0) {
    const seed = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
    await pool.query(seed);
    console.log('Categorias e exemplos iniciais inseridos.');
  }

  // Importa o catálogo de 142 milagres eucarísticos (roda uma única vez,
  // idempotente: só executa se ainda houver poucos registros na categoria).
  const bulkFile = path.join(__dirname, 'db', '142_milagres_eucaristicos.sql');
  if (fs.existsSync(bulkFile)) {
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*)::int AS total FROM entries e
       JOIN categories c ON c.id = e.category_id
       WHERE c.slug = 'milagres-eucaristicos'`
    );
    if (countRows[0].total < 100) {
      const bulk = fs.readFileSync(bulkFile, 'utf8');
      await pool.query(bulk);
      console.log('Catálogo de 142 milagres eucarísticos importado.');
    }
  }

  // Remove duplicatas: mantém a versão mais detalhada (do seed.sql original)
  // quando o mesmo milagre também veio do catálogo de 142. Idempotente.
  const cleanupFile = path.join(__dirname, 'db', '142_limpeza_duplicados.sql');
  if (fs.existsSync(cleanupFile)) {
    const cleanupSql = fs.readFileSync(cleanupFile, 'utf8');
    await pool.query(cleanupSql);
  }

  // Importa o catálogo de santos e beatos do Calendário Romano Geral
  // (celebrações universais da Igreja). Idempotente: só roda se ainda
  // houver poucos registros na categoria.
  const santosFile = path.join(__dirname, 'db', 'santos_calendario_romano.sql');
  if (fs.existsSync(santosFile)) {
    const { rows: santosCountRows } = await pool.query(
      `SELECT COUNT(*)::int AS total FROM entries e
       JOIN categories c ON c.id = e.category_id
       WHERE c.slug = 'santos'`
    );
    if (santosCountRows[0].total < 100) {
      const santosSql = fs.readFileSync(santosFile, 'utf8');
      await pool.query(santosSql);
      console.log('Catálogo de santos e beatos importado.');
    }
  }

  // Aplica fotos (Wikimedia Commons, licença livre) para os milagres mais conhecidos.
  // Idempotente: só preenche image_url onde ainda está NULL, então é seguro
  // rodar em todo boot.
  const photosFile = path.join(__dirname, 'db', '142_fotos_conhecidos.sql');
  if (fs.existsSync(photosFile)) {
    const photosSql = fs.readFileSync(photosFile, 'utf8');
    await pool.query(photosSql);
  }
}

function requireAdmin(req, res, next) {
  const key = req.header('x-admin-key');
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Chave de administrador inválida.' });
  }
  next();
}

// ---------- ROTAS DA API ----------

// Lista categorias
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, slug, name, description, color FROM categories ORDER BY sort_order, name'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
});

// Busca / lista de entradas (com filtro por categoria e texto de pesquisa)
app.get('/api/entries', async (req, res) => {
  try {
    const { q, category, limit = 50, offset = 0 } = req.query;
    const conditions = [];
    const params = [];

    if (category && category !== 'todas') {
      params.push(category);
      conditions.push(`c.slug = $${params.length}`);
    }

    if (q && q.trim() !== '') {
      params.push(`%${q.trim()}%`);
      const idx = params.length;
      conditions.push(
        `(e.title ILIKE $${idx} OR e.summary ILIKE $${idx} OR e.content ILIKE $${idx} OR e.location ILIKE $${idx})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(Number(limit));
    params.push(Number(offset));

    const query = `
      SELECT e.id, e.title, e.summary, e.location, e.event_date, e.image_url, e.source_url,
             c.slug AS category_slug, c.name AS category_name, c.color AS category_color
      FROM entries e
      JOIN categories c ON c.id = e.category_id
      ${where}
      ORDER BY e.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros.' });
  }
});

// Detalhe de uma entrada
app.get('/api/entries/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, c.slug AS category_slug, c.name AS category_name, c.color AS category_color
       FROM entries e JOIN categories c ON c.id = e.category_id
       WHERE e.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Registro não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registro.' });
  }
});

// Cria nova entrada (protegido por chave de administrador)
app.post('/api/entries', requireAdmin, async (req, res) => {
  try {
    const { category_slug, title, summary, content, location, event_date, image_url, source_url } = req.body;
    if (!category_slug || !title) {
      return res.status(400).json({ error: 'category_slug e title são obrigatórios.' });
    }
    const cat = await pool.query('SELECT id FROM categories WHERE slug = $1', [category_slug]);
    if (!cat.rows.length) return res.status(400).json({ error: 'Categoria inválida.' });

    const { rows } = await pool.query(
      `INSERT INTO entries (category_id, title, summary, content, location, event_date, image_url, source_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [cat.rows[0].id, title, summary, content, location, event_date, image_url, source_url]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar registro.' });
  }
});

// Atualiza entrada existente
app.put('/api/entries/:id', requireAdmin, async (req, res) => {
  try {
    const { title, summary, content, location, event_date, image_url, source_url } = req.body;
    await pool.query(
      `UPDATE entries SET title=$1, summary=$2, content=$3, location=$4, event_date=$5,
       image_url=$6, source_url=$7, updated_at=NOW() WHERE id=$8`,
      [title, summary, content, location, event_date, image_url, source_url, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar registro.' });
  }
});

// Remove entrada
app.delete('/api/entries/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM entries WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover registro.' });
  }
});

// Healthcheck (útil para o Render)
app.get('/healthz', (req, res) => res.send('ok'));

// Qualquer outra rota devolve o front-end (SPA simples)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao preparar o banco de dados:', err);
    process.exit(1);
  });
