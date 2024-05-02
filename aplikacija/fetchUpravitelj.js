const FilmoviPretrazivanje = require("./filmoviPretrazivanje.js");
const jwt = require("./moduli/jwt.js")
const Autentifikacija = require("./autentifikacija.js")
const portRest = 12479;
const url = "http://localhost:" + portRest + "/baza";
class FetchUpravitelj {
	
constructor(tajniKljucJWT){
	this.auth = new Autentifikacija();
	this.fp = new FilmoviPretrazivanje();
	this.tajniKljucJWT = tajniKljucJWT
}
dajPodatkeIzJWT = async function(zahtjev,odgovor){
    try{
        if(zahtjev.session.jwt){
       let podaci =  jwt.uvijekProvjeriToken(zahtjev.session.jwt,this.tajniKljucJWT)
       let od =  JSON.stringify(podaci)
       odgovor.send(od)
    }else {
        odgovor.send({id:0})
    }
    }catch(err){
        console.log(err)
    }
    
}
dajSezone = async function(zahtjev,odgovor){
    let serijaID = zahtjev.query.serijaID
    odgovor.json(await this.fp.dajSezone(serijaID))
}
dajSerije = async function(zahtjev,odgovor){
    let korid = zahtjev.query.korid
    odgovor.json(await this.fp.dajSerijeFavorite(korid))
}
aktvacijaRacuna = async function (zahtjev, odgovor) {
    let korime = zahtjev.query.korime;
    let kod = zahtjev.query.kod;

    let poruka = await this.auth.aktivirajKorisnickiRacun(korime, kod);

    if (poruka.status == 200) {
        odgovor.send(await poruka.text());
    } else {
        odgovor.send(await poruka.text());
    }
}

dajSveZanrove = async function (zahtjev, odgovor) {
    odgovor.json(await this.fp.dohvatiSveZanrove());
}
dajDvaFilma = async function (zahtjev, odgovor) {
    odgovor.json(await this.fp.dohvatiNasumceFilm(zahtjev.query.zanr))
}

getJWT = async function (zahtjev, odgovor) {
    try {
        odgovor.type('json')
    if (zahtjev.session.jwt != null) {
        odgovor.json({jwtToken:zahtjev.session.jwt})
    } 
    odgovor.status(401);
    odgovor.send({ greska: "nemam token!" });
    } catch (error) {
        
    }
    
}

serijePretrazivanje = async function (zahtjev, odgovor) {
            let str = zahtjev.query.str;
            let filter = zahtjev.query.filter;
            odgovor.json(await this.fp.dohvatiSerije(str,filter))       
}
serijaDetalji = async function(zahtjev,odgovor){
    let id = zahtjev.query.id

    odgovor.json(await this.fp.dohvatiSerijuDetalje(id))
}
dodajSeriju = async function(zahtjev,odgovor){
    try {
       let zaglavlje = new Headers();
      zaglavlje.set("Content-Type", "application/json");
    
      let parametri = {
        method: "POST",
        body: JSON.stringify(zahtjev.body),
        headers: zaglavlje,
      };
    if (!zahtjev.session.jwt) {
        odgovor.status(401);
        odgovor.json({ greska: "neaoutorizirani pristup" });
     } else {
        odgovor.status(200);
        odgovor.json({success:"Sucess"})
        let podaci = await fetch(url+"/favoriti",parametri)
       
     } 
    } catch (error) {
        console.log("Istek vremena")
    }
    
}


}
module.exports = FetchUpravitelj
