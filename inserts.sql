-- Category

INSERT INTO CATEGORY VALUES(1,'Légume', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(2,'Fruit', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(3,'Fromage', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(4,'Boisson', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(5,'Boisson alcoolisée', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(6,'Céréale', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(7,'Viande', SYSDATE(), SYSDATE(), null);
INSERT INTO CATEGORY VALUES(8,'Pain', SYSDATE(), SYSDATE(), null);

-- Products

INSERT INTO PRODUCT VALUES(1, 'Aubergine', 1, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(2,  'Poireau', 1, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(3,  'Epinard', 1, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(4,  'Pomme', 2, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(5,  'Abricot', 2, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(6,  'Citron', 2, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(7,  'Morbier', 3, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(8,  'Fromage de chèvre', 3, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(9,  'Camembert', 3, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(10,  'Jus de pomme', 4, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(11,  'Limonade', 4, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(12,  'Jus de fruit', 4, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(13,  'Vin rouge', 5, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(14,  'Vin blanc', 5, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(15,  'Eau de vie', 5, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(16,  'Avoine', 6, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(17,  'Blé', 6, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(18,  'Riz', 6, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(19,  'Boeuf', 7, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(20,  'Porc', 7, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(21,  'Canard', 7, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(22, 'Brioche', 8, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(23, 'Pain blanc', 8, SYSDATE(), SYSDATE(), null);
INSERT INTO PRODUCT VALUES(24, 'Pain complet', 8,SYSDATE(), SYSDATE(), null);

-- Units

INSERT INTO UNIT VALUES(1, 'Unité', SYSDATE(), SYSDATE(), null);
INSERT INTO UNIT VALUES(2, 'Kg', SYSDATE(), SYSDATE(), null);
INSERT INTO UNIT VALUES(3, 'Litres', SYSDATE(), SYSDATE(), null);

-- motif

INSERT INTO motif VALUES(1, "Commande non reçu", "ORDER", "Je n'ai pas reçu ma commande", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(2, "Commande incomplète", "ORDER","La commande que j'ai reçu est incomplète", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(3, "Commande non conforme", "ORDER", "Je reçu la commande mais elle ne contient pas les bon produits.", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(4, "Contenu à caractère sexuel", "ITEM", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(5, "Contenu violent ou abject", "ITEM", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(6, "Contenu offensant ou haineux", "ITEM", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(7, "Spam ou contenu trompeur", "ITEM", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(8, "Contenu à caractère sexuel", "PRODUCER", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(9, "Contenu violent ou abject", "PRODUCER", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(10, "Contenu offensant ou haineux", "PRODUCER", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(11, "Spam ou contenu trompeur", "PRODUCER", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(12, "Contenu à caractère sexuel", "PRODUCERGROUP", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(13, "Contenu violent ou abject", "PRODUCERGROUP", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(14, "Contenu offensant ou haineux", "PRODUCERGROUP", "", SYSDATE(), SYSDATE(), null);
INSERT INTO motif VALUES(15, "Spam ou contenu trompeur", "PRODUCERGROUP", "", SYSDATE(), SYSDATE(), null);


commit;