const TMDBklijent = require("./klijentTMDB.js");

class RestTMDB {

    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        console.log(api_kljuc);
        
        //this.tmdbKlijent.dohvatiFilm(500).then(console.log).catch(console.log);
    }

    getZanr(zahtjev, odgovor) {
        this.tmdbKlijent.dohvatiZanrove().then((zanrovi) => {
            //console.log(zanrovi);
            odgovor.type("application/json")
            odgovor.send(zanrovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    getSerijaDetalji(zahtjev,odgovor){
        let id = zahtjev.query.id
        this.tmdbKlijent.dohvatiSerijuDetalji(id).then((serija)=>{
           
            odgovor.send(serija)
        }).catch((greska)=>{
            odgovor.json(greska)
        })
    }

    getSerije(zahtjev, odgovor) {
        odgovor.type("application/json")
        let stranica = zahtjev.query.stranica;
        let trazi = zahtjev.query.trazi;

        if(stranica == null || trazi==null){
            odgovor.status("417");
            odgovor.send({greska: "neocekivani podaci"});
            return;
        } 

        this.tmdbKlijent.pretraziSerijePoNazivu(trazi,stranica).then((serije) => {
            //console.log(filmovi);
            odgovor.send(serije);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }
}

module.exports = RestTMDB;
