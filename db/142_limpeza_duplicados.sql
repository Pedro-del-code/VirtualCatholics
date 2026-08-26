-- Remove as versões duplicadas e mais genéricas que vieram do catálogo de 142,
-- mantendo os registros mais detalhados que já existiam no seed.sql original
-- (Lanciano e Buenos Aires, escritos à mão com mais contexto histórico).
-- Idempotente: seguro rodar em todo boot (não faz nada se já foi removido).

DELETE FROM entries
WHERE category_id = (SELECT id FROM categories WHERE slug = 'milagres-eucaristicos')
  AND title IN ('Lanciano', 'Buenos Aires')
  AND source_url LIKE 'https://eucharisticmiracles.faith/%';
