const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
const portRest = 12479;
class Autentifikacija {
	async dodajKorisnika(korisnik,jwtToken) {
		try {
			
			let korisnici = await fetch("http://localhost:"+portRest+"/baza/korisnici?jwt="+jwtToken)
			let korisnikPodaci = await JSON.parse(await korisnici.text())
			for(let kor of korisnikPodaci){
				if(kor.korime == korisnik.korime){
					return false
				}
			}
			let tijelo = {
			ime: korisnik.ime,
			prezime: korisnik.prezime,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
			email: korisnik.email,
			korime: korisnik.korime,
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici?jwt="+jwtToken,
			parametri
		);

		if (odgovor.status == 200) {
			
			return true;
		} else {
		
			return false;
		}
		} catch (error) {
			console.log("Greska u registraciji")
		}
		
	}

	async aktivirajKorisnickiRacun(korime, kod) {
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
		let parametri = {
			method: "PUT",
			body: JSON.stringify({ aktivacijskiKod: kod }),
			headers: zaglavlje,
		};

		return await fetch(
			"http://localhost:" +
				portRest +
				"/baza/korisnici/" +
				korime +
				"/aktivacija",
			parametri
		);
	}

	async prijaviKorisnika(korime, lozinka,totp) {
		lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
		let tijelo = {
			lozinka: lozinka,
			totp: totp
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);

		if (odgovor.status == 200) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
