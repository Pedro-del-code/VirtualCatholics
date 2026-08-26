// Aplica o schema.sql e o seed.sql no banco definido em DATABASE_URL.
// Uso: npm run seed
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Defina a variável de ambiente DATABASE_URL antes de rodar o seed.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  const client = await pool.connect();
  try {
    console.log('Aplicando schema...');
    await client.query(schema);
    console.log('Inserindo dados iniciais...');
    await client.query(seed);
    console.log('Banco de dados pronto.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Erro ao rodar o seed:', err);
  process.exit(1);
});
