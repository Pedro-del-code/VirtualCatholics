-- ============================================================
-- ESQUEMA DO BANCO DE DADOS
-- Site: Acervo de Fé
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(60) UNIQUE NOT NULL,
    name        VARCHAR(120) NOT NULL,
    description TEXT,
    color       VARCHAR(20) DEFAULT '#7A2E2E',
    sort_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS entries (
    id            SERIAL PRIMARY KEY,
    category_id   INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    summary       TEXT,
    content       TEXT,
    location      VARCHAR(255),
    event_date    VARCHAR(120),
    image_url     TEXT,
    source_url    TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para acelerar a busca
CREATE INDEX IF NOT EXISTS idx_entries_category ON entries(category_id);
CREATE INDEX IF NOT EXISTS idx_entries_title_trgm ON entries (lower(title));
CREATE INDEX IF NOT EXISTS idx_entries_search
    ON entries USING GIN (to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(content,'')));
