
const Baza = require("./baza.js");

class SerijaDAO {

	constructor() {
		this.baza = new Baza("../../RWA2023mstura21.sqlite");
	}

	dajSveFavorite = async function (id) {
		try {
			this.baza.spojiSeNaBazu();
		let sql = `SELECT s.* FROM serija s JOIN favoriti f ON s.id = f.serija_id
		JOIN korisnik k ON f.korisnik_id = k.id
		WHERE k.id = ?;`
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		return podaci;
		} catch (error) {
			
		}
		
	}
	dodajSezone = async function(serija){
		try {
			console.log("dodajSezone1")
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO sezona (id,broj_epizoda, broj_sezone, naziv, opis, serija_id)
		VALUES
		  (?,?,?,?,?,?);`
		  console.log(serija.sezone)
		  for(let sezona of serija.sezone){
			
			var podaci = await this.baza.izvrsiUpit(sql, [sezona.id,sezona.episode_count,sezona.name,sezona.name,sezona.overview,serija.serijaID]);
		  }
		
		this.baza.zatvoriVezu();

		return podaci;
		} catch (error) {
			
		}
		
	}
	spremiDnevnikPOST = async function(korpodaci){
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO dnevnik (metoda,detalji,korisnik_id) VALUES (?,?,?)`;
        let podaci = ["POST","Post metoda",korpodaci.korID];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
	spremiDnevnikGET = async function(korid){
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO dnevnik (metoda,detalji,korisnik_id) VALUES (?,?,?)`;
        let podaci = ["GET","Get metoda",korid];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}


	dajSezone = async function(serijaID){
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM sezona WHERE serija_id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [serijaID]);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (naziv) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM serija WHERE naziv=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [naziv]);
		this.baza.zatvoriVezu();
		
			console.log(podaci[0]+podaci[1]+": podaci")
		
		if(podaci.length == 1)
			return podaci[0];
		else 
			return 
		null;
	}

	dodaj = async function (serija) {
		try {
			this.baza.spojiSeNaBazu();
		console.log(serija)
		let sql = `INSERT INTO serija (id,naziv,opis,broj_sezona,broj_epizoda,popularnost,poster_putanja,poveznica) VALUES (?,?,?,?,?,?,?,?)`;
        let podaci = [serija.serijaID,serija.naziv,serija.opis,
                      serija.broj_sezona,serija.broj_epizoda,serija.popularnost,serija.poster_putanja,serija.poveznica];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
		} catch (error) {
			
		}
		
	}
	dodajFavorti = async function(serija){
		try{
			this.baza.spojiSeNaBazu();
			let sql = `INSERT INTO favoriti (korisnik_id,serija_id) VALUES (?,?)`
		console.log("VRIJEDNOSTI"+serija.serijaID+" "+serija.korID)
		let podaci = [serija.korID,serija.serijaID]
		await this.baza.izvrsiUpit(sql,podaci)
		return true
		}catch(err){
		}
		
	}
	dohvatiDnevnik = async function(poredak,stranica,broj_podataka_po_stranici) {
		try {
			const offset = (stranica - 1) * broj_podataka_po_stranici;
			let sql
			if(poredak == 1){
				 sql = `SELECT * FROM dnevnik
				 ORDER BY datum DESC
				 LIMIT ? OFFSET ?;`
			}else{
				sql = `SELECT * FROM dnevnik
				 ORDER BY datum ASC
				 LIMIT ? OFFSET ?;`
			}
			
		let podaci = await this.baza.izvrsiUpit(sql,[broj_podataka_po_stranici,offset]);
		return podaci;
		} catch (error) {
			
		}
		
	}
	obrisi = async function (serija_id,kor_id) {
		let sql = "DELETE FROM favoriti WHERE serija_id=? AND korisnik_id = ?";
		await this.baza.izvrsiUpit(sql,[serija_id,kor_id]);
		return true;
	}
	spremiDnevnikDELETE = async function(id){
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO dnevnik (metoda,detalji,korisnik_id) VALUES (?,?,?)`;
        let podaci = ["DELETE","Delete metoda",id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	
}

module.exports = SerijaDAO;
