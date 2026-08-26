-- Atualiza fotos (Wikimedia Commons, licenca livre) dos milagres mais conhecidos

UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/First_Sculpture_of_Our_Lady_of_Fatima.jpg' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/fatima-angel-of-peace-1916' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Basilica_di_San_Francesco_%28Siena%29.JPG' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/ita-siena' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chiesa_Corpus_Domini_Torino.JPG' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/ita-turin-1453' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mirakel_van_Amsterdam%2C_gravure_J._Walter_%28coll._Catharijne_Convent%29.jpg' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/amsterdam-1345' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Blutkorporale%2C_Walld%C3%BCrn_%28Germany%29.JPG' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/ger-wallduern' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Miracle_of_Bolsena.JPG' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/ita-bolsena' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Milagre_Eucar%C3%ADstico_de_Santar%C3%A9m.png' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/por-santarem' AND image_url IS NULL;
UPDATE entries SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Miracolo_Eucaristico_di_Lanciano_-_foto_dal_vivo.JPG' WHERE source_url = 'https://eucharisticmiracles.faith/miracle/ita-lanciano' AND image_url IS NULL;
