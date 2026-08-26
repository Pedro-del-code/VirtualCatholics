-- ============================================================
-- DADOS INICIAIS
-- ============================================================

INSERT INTO categories (slug, name, description, color, sort_order) VALUES
('milagres-eucaristicos', 'Milagres Eucarísticos', 'Fatos e eventos ligados a manifestações extraordinárias na Sagrada Eucaristia.', '#7A2E2E', 1),
('santos', 'Santos e Beatos', 'Vidas, histórias e testemunhos de santos e beatos da Igreja Católica.', '#A6771F', 2),
('aparicoes-marianas', 'Aparições Marianas', 'Aparições de Nossa Senhora reconhecidas ou em estudo pela Igreja.', '#1F2A44', 3),
('reliquias', 'Relíquias', 'Relíquias de santos, mártires e objetos ligados à fé cristã.', '#5B6B4D', 4),
('oracoes-e-devocoes', 'Orações e Devoções', 'Orações tradicionais, novenas e devoções da Igreja Católica.', '#6B4C6B', 5)
ON CONFLICT (slug) DO NOTHING;

-- Milagres Eucarísticos
INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Milagre Eucarístico de Lanciano',
 'A hóstia consagrada transformou-se visivelmente em carne e o vinho em sangue no século VIII.',
 'Por volta do ano 700, em um mosteiro de Lanciano (Itália), um monge basiliano que duvidava da presença real de Cristo na Eucaristia viu a hóstia se transformar em tecido de carne e o vinho em sangue durante a consagração. Exames científicos realizados no século XX confirmaram tratar-se de tecido cardíaco humano e sangue do tipo AB, preservados sem conservantes por séculos.',
 'Lanciano, Itália', 'Século VIII', 'https://www.miracolieucaristici.org'
FROM categories WHERE slug = 'milagres-eucaristicos';

INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Milagre Eucarístico de Buenos Aires',
 'Fragmento de hóstia consagrada apresentou tecido cardíaco em exames laboratoriais, em caso investigado com apoio do então Cardeal Jorge Bergoglio.',
 'Em 1996, na paróquia Santa Maria de Buenos Aires, uma hóstia caída no chão foi guardada em água para se dissolver, mas transformou-se em uma substância avermelhada semelhante a carne. Análises posteriores, incluindo estudo do patologista Ricardo Castañón, identificaram tecido do músculo cardíaco em estado inflamatório, compatível com sofrimento intenso.',
 'Buenos Aires, Argentina', '1996', 'https://www.miracolieucaristici.org'
FROM categories WHERE slug = 'milagres-eucaristicos';

-- Santos
INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Santo Padre Pio de Pietrelcina',
 'Frade capuchinho italiano conhecido pelos estigmas, pelo dom de bilocação e por décadas dedicadas à confissão.',
 'Francesco Forgione, conhecido como Padre Pio, nasceu em 1887 em Pietrelcina, Itália. Ingressou na Ordem dos Frades Menores Capuchinhos e recebeu os estigmas de Cristo em 1918, mantendo-os visíveis por cerca de 50 anos. Dedicou grande parte da vida ao sacramento da confissão, chegando a atender dezenas de fiéis por dia. Foi canonizado em 2002 pelo Papa João Paulo II.',
 'Pietrelcina / San Giovanni Rotondo, Itália', '1887–1968', 'https://www.vatican.va'
FROM categories WHERE slug = 'santos';

INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Santa Teresinha do Menino Jesus',
 'Carmelita descalça francesa, Doutora da Igreja, conhecida pela espiritualidade do "caminho da infância espiritual".',
 'Thérèse Martin nasceu em 1873 em Alençon, França, e entrou ainda jovem no Carmelo de Lisieux. Desenvolveu uma espiritualidade simples baseada na confiança total em Deus, descrita em sua autobiografia "História de uma Alma". Morreu de tuberculose em 1897, aos 24 anos, e foi canonizada em 1925. Em 1997 foi declarada Doutora da Igreja pelo Papa João Paulo II.',
 'Lisieux, França', '1873–1897', 'https://www.vatican.va'
FROM categories WHERE slug = 'santos';

-- Aparições Marianas
INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Nossa Senhora de Fátima',
 'Aparições de Nossa Senhora a três pastorinhos em Portugal, incluindo o episódio conhecido como "Milagre do Sol".',
 'Entre maio e outubro de 1917, Nossa Senhora apareceu a Lúcia dos Santos, Francisco e Jacinta Marto na Cova da Iria, Fátima, Portugal. As aparições incluíram mensagens de oração pela paz e conversão. No dia 13 de outubro de 1917, cerca de 70 mil pessoas testemunharam um fenômeno solar extraordinário, hoje conhecido como "Milagre do Sol". A Igreja reconheceu oficialmente as aparições em 1930.',
 'Fátima, Portugal', '1917', 'https://www.fatima.pt'
FROM categories WHERE slug = 'aparicoes-marianas';

INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Nossa Senhora de Lourdes',
 'Aparições a Santa Bernadette Soubirous em uma gruta, origem de um dos maiores santuários de peregrinação do mundo.',
 'Em 1858, Nossa Senhora apareceu 18 vezes à jovem Bernadette Soubirous na gruta de Massabielle, em Lourdes, França. Durante as aparições, surgiu uma fonte de água associada a inúmeras curas ao longo dos anos. A Igreja aprovou oficialmente o culto em 1862, e Lourdes tornou-se um dos principais destinos de peregrinação católica no mundo.',
 'Lourdes, França', '1858', 'https://www.lourdes-france.org'
FROM categories WHERE slug = 'aparicoes-marianas';

-- Relíquias
INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Santo Sudário de Turim',
 'Pano de linho que envolveu o corpo de um homem crucificado, venerado como a mortalha de Jesus Cristo.',
 'O Santo Sudário é um lençol de linho de cerca de 4,4 por 1,1 metros que apresenta a imagem frontal e dorsal de um homem que sofreu marcas compatíveis com a crucificação. Está conservado na Catedral de São João Batista, em Turim, Itália, desde 1578. Seu estudo científico segue sendo debatido, mas é um dos objetos mais examinados da história.',
 'Turim, Itália', 'Conservado desde 1578', 'https://www.sindone.org'
FROM categories WHERE slug = 'reliquias';

-- Orações e Devoções
INSERT INTO entries (category_id, title, summary, content, location, event_date, source_url)
SELECT id, 'Terço / Santo Rosário',
 'Devoção mariana tradicional que medita os mistérios da vida de Cristo através de orações repetidas em contas.',
 'O Santo Rosário é uma oração vocal e contemplativa que combina o Pai-Nosso, a Ave-Maria e o Glória, organizados em cinco dezenas que meditam os mistérios Gozosos, Dolorosos, Gloriosos e Luminosos. Tradicionalmente associado a São Domingos e amplamente promovido após as aparições de Fátima como instrumento de oração pela paz.',
 NULL, 'Tradição desde o século XIII', 'https://www.vatican.va'
FROM categories WHERE slug = 'oracoes-e-devocoes';
