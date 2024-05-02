const portRest = 12479;
const url = "http://localhost:" + portRest + "/baza";
const kodovi = require("./moduli/kodovi.js");
class FilmoviZanroviPretrazivanje {
	async dohvatiSerije(stranica, kljucnaRijec = "") {
		let putanja =
			url + "/tmdb/serije?stranica=" + stranica + "&trazi=" + kljucnaRijec;
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		
		return serije;
	}
	async dajSezone(serijaID){
		try {
			let putanja = url+"/sezone?serijaID="+serijaID
		let odgovor = await fetch(putanja)
		let podaci = await odgovor.text()
		let sezona = JSON.parse(podaci)
		return sezona
		} catch (error) {
			
		}
	}
	async dohvatiSerijuDetalje(id){
		let putanja = url+"/tmdb/serijeDetalji?id="+id
		let odgovor = await fetch(putanja);
		
		let podaci = await odgovor.text();
		
		let serija = JSON.parse(podaci);
		
		return serija;

	}
	async dajSerijeFavorite(id){
		const putanja = url+"/favoriti/"+id
		let odgovor = await fetch(putanja)
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		return serije;
	}
	
}

module.exports = FilmoviZanroviPretrazivanje;
