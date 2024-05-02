const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("../../RWA2023mstura21.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	spremiDnevnikPUT = async function(korpodaci){
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO dnevnik (metoda,detalji,korisnik_id) VALUES (?,?,?)`;
        let podaci = ["PUT","Put metoda",korpodaci.id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
	spremiDnevnikDELETE = async function(id){
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO dnevnik (metoda,detalji,korisnik_id) VALUES (?,?,?)`;
        let podaci = ["DELETE","Delete metoda",2];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
	spremiTotp = async function(id,totp){
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET totp_enabled=? WHERE id=?`;
        let podaci = [totp,id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
	resetirajTotp = async function(id){
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET totp_enabled=? WHERE id=?`;
        let podaci = [0,id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		
			console.log(podaci[0]+podaci[1]+": podaci")
		
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik) {
		try {
			console.log(korisnik)
		let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id) VALUES (?,?,?,?,?,?)`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,korisnik.korime,1];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
		} catch (error) {
			console.log("Greska")
		}
		
	}

	obrisi = async function (korime) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		return true;
	}

	obrisiFavorite = async function (korID) {
		let sql = "DELETE FROM favoriti WHERE korisnik_id=?";
		await this.baza.izvrsiUpit(sql,[korID]);
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		let sql = `UPDATE korisnik SET ime=?, prezime=?,adresa=?,dob=?,drzava=? WHERE korime=?`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.adresa,korisnik.dob,korisnik.drzava,korime];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
}

module.exports = KorisnikDAO;
