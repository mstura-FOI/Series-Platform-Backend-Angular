-- Creator:       MySQL Workbench 8.0.34/ExportSQLite Plugin 0.1.0
-- Author:        mustr
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-11-03 17:37
-- Created:       2023-10-21 22:04

BEGIN;
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);
CREATE TABLE "serija"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "opis" TEXT,
  "broj_sezona" INTEGER NOT NULL,
  "broj_epizoda" INTEGER NOT NULL,
  "popularnost" INTEGER,
  "poster_putanja" VARCHAR(200),
  "poveznica" VARCHAR(200)
);
CREATE TABLE "sezona"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "broj_epizoda" INTEGER NOT NULL,
  "broj_sezone" INTEGER NOT NULL,
  "naziv" VARCHAR(45),
  "opis" TEXT,
  "serija_id" INTEGER NOT NULL,
  CONSTRAINT "fk_sezona_serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "serija"("id")
);
CREATE INDEX "sezona.fk_sezona_serija1_idx" ON "sezona" ("serija_id");
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "adresa" TEXT,
  "korime" VARCHAR(45) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "dob" VARCHAR(100),
  "drzava" VARCHAR(200),
  "tip_korisnika_id" INTEGER NOT NULL,
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika_idx" ON "korisnik" ("tip_korisnika_id");
CREATE TABLE "favoriti"(
  "korisnik_id" INTEGER NOT NULL,
  "serija_id" INTEGER NOT NULL,
  PRIMARY KEY("korisnik_id","serija_id"),
  CONSTRAINT "fk_favoriti_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id"),
  CONSTRAINT "fk_favoriti_serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "serija"("id")
);
CREATE INDEX "favoriti.fk_favoriti_serija1_idx" ON "favoriti" ("serija_id");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "datum" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "metoda" VARCHAR(10) NOT NULL,
  "detalji" TEXT,
  "korisnik_id" INTEGER,
  CONSTRAINT "fk_dnevnik_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
    ON DELETE SET NULL
);

CREATE INDEX "dnevnik.fk_dnevnik_korisnik1_idx" ON "dnevnik" ("korisnik_id");
COMMIT;


INSERT INTO tip_korisnika (naziv, opis) VALUES ('registrirani korisnik', 'Uloga za obične korisnike');


INSERT INTO tip_korisnika (naziv, opis) VALUES ('administrator', 'Uloga za administratore');


INSERT INTO korisnik (ime, prezime, adresa, korime, lozinka, email,dob,drzava, tip_korisnika_id)
VALUES ('Marino', 'Stura', 'Adresa 1', 'obican', '2317c5cc4e67b0cb5f55b26fdcf5fe0a24012503ae99d22b26f3c866d281be2b', 'mstura@mail.com', 21,"Croatia" , 1);


INSERT INTO korisnik (ime, prezime, adresa, korime, lozinka, email,dob,drzava ,tip_korisnika_id)
VALUES ('Matija', 'Novak', 'Adresa 2', 'admin', '2317c5cc4e67b0cb5f55b26fdcf5fe0a24012503ae99d22b26f3c866d281be2b', 'matnovak.mail.net', 35 ,"Croatia" ,2);
