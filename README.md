# Acervo de Fé

Site com barra de pesquisa e categorias (Milagres Eucarísticos, Santos, Aparições
Marianas, Relíquias, Orações e Devoções), com banco de dados PostgreSQL para
armazenar cada novo registro. Pronto para publicar no **Render.com**.

## Estrutura do projeto

```
site/
├── server.js          # servidor Express + API REST
├── package.json
├── render.yaml         # configuração de deploy automático no Render
├── db/
│   ├── schema.sql      # criação das tabelas
│   ├── seed.sql        # categorias e exemplos iniciais
│   └── run-seed.js     # script para popular o banco manualmente
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

## Como funciona

- **Categorias** ficam na tabela `categories` (slug, nome, cor, descrição).
- **Registros** (milagres, santos, aparições etc.) ficam na tabela `entries`,
  cada um ligado a uma categoria.
- A barra de pesquisa consulta `/api/entries?q=termo&category=slug` e filtra
  por título, resumo, conteúdo e local.
- Ao iniciar, o servidor cria as tabelas automaticamente (se não existirem) e
  insere os exemplos do `seed.sql` caso o banco esteja vazio — não precisa
  rodar nada manualmente na primeira vez.
- O botão **"+ Adicionar registro"** no site abre um formulário para cadastrar
  novos itens em qualquer categoria. É protegido por uma **chave de
  administrador** (variável de ambiente `ADMIN_KEY`).

## Deploy no Render.com (recomendado — via Blueprint)

1. Suba esta pasta para um repositório no GitHub (ou GitLab).
2. No painel do Render, clique em **New +** → **Blueprint**.
3. Selecione o repositório. O Render vai ler o `render.yaml` e criar
   automaticamente:
   - Um banco **PostgreSQL** gratuito (`acervo-fe-db`).
   - Um **Web Service** Node.js (`acervo-fe-site`) já conectado ao banco.
   - Uma `ADMIN_KEY` gerada automaticamente (veja em **Environment** do
     serviço para copiá-la e poder usar o formulário de administrador).
4. Clique em **Apply**. Em poucos minutos o site estará no ar em uma URL do
   tipo `https://acervo-fe-site.onrender.com`.

## Deploy manual (sem Blueprint)

1. Crie um banco **PostgreSQL** no Render (New + → PostgreSQL) e copie a
   **Internal Database URL**.
2. Crie um **Web Service** (New + → Web Service) apontando para o
   repositório:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Em **Environment**, adicione:
   - `DATABASE_URL` = URL copiada do banco
   - `ADMIN_KEY` = uma senha forte de sua escolha
4. Deploy. O servidor cria as tabelas e os exemplos sozinho na primeira
   execução.

## Rodando localmente

```bash
cp .env.example .env
# edite o .env com sua DATABASE_URL local (PostgreSQL) e uma ADMIN_KEY
npm install
npm start
# acesse http://localhost:3000
```

Se preferir popular o banco manualmente (fora do primeiro boot automático):

```bash
npm run seed
```

## Adicionando novas categorias

Basta inserir uma nova linha na tabela `categories`, por exemplo direto no
banco (via Render Dashboard → Database → Shell/psql):

```sql
INSERT INTO categories (slug, name, description, color, sort_order)
VALUES ('milagres-marianos', 'Milagres Marianos', 'Curas e sinais atribuídos à intercessão de Maria.', '#8A4B2E', 6);
```

A categoria aparece automaticamente na barra de filtros e no formulário de
cadastro, sem precisar mexer no código.

## Segurança

O formulário de administrador é uma proteção simples baseada em uma chave
compartilhada (`ADMIN_KEY`), adequada para uso pessoal ou de um pequeno grupo
de colaboradores. Para um site público com múltiplos editores, recomenda-se
evoluir para um sistema de login com usuários e senhas (ex.: `bcrypt` +
sessões ou JWT).
