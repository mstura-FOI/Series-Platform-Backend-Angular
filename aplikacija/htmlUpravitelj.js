const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js")
const Autentifikacija = require("./autentifikacija.js");
const { json } = require("stream/consumers");
var idSerije = null
let Konfiguracija = require('./konfiugiracija.js')
let konf = new Konfiguracija()
class HtmlUpravitelj {

constructor(secret,tajniKljucJWT){
	this.secretKey = secret
    this.tajniKljucJWT = tajniKljucJWT
	this.auth = new Autentifikacija();
}
profil = async function(zahtjev,odgovor){
    let profil = await ucitajStranicu("profil")
    odgovor.send(profil)
}
dnevnik = async function(zahtjev,odgovor){
    let dnevnik = await ucitajStranicu("dnevnik")
    odgovor.send(dnevnik)
}
favoriti = async function (zahtjev,odgovor){
    let favoriti = await ucitajStranicu("favoriti")
    odgovor.send(favoriti)
}
pocetna = async function (zahtjev, odgovor) {
    let pocetna = await ucitajStranicu("pocetna")

    odgovor.send(pocetna);
}
serijaDetalji = async function(zahtjev,odgovor){
     idSerije = zahtjev.query.id
   
  
}

dokumentacija = async function(zahtjev,odgovor){
    let dok = ucitajdokumentaciju()
 
    odgovor.send(dok)
}
korisnici = async function(zahtjev,odgovor){
    let kor = await ucitajStranicu("korisnici")
    odgovor.send(kor)
}
registracija = async function (zahtjev, odgovor) {
    try {
     let greska = "";

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=`+zahtjev.body.token)
  

    const data = await response.json();
    console.log(data)
    if (zahtjev.method == "POST") {
        let uspjeh = await this.auth.dodajKorisnika(zahtjev.body,zahtjev.session.jwt);
        if (uspjeh) {
            odgovor.status(200)
            odgovor.json({success:"Uspjeh"})
            return;
        } else {
            greska = "Dodavanje nije uspjelo provjerite podatke!";
        }
    }
        }catch(err){

    }
}
odjava = async function (zahtjev, odgovor) {
    zahtjev.session.korisnik = null;
    zahtjev.session.jwt = null
    odgovor.status(200)
    odgovor.json({LogOutStatus:"Successfull"})
};

provjeri = async function (zahtjev,odgovor){
    try {
        var podaci = jwt.uvijekProvjeriToken(zahtjev.session.jwt,this.tajniKljucJWT)
  
    if(zahtjev.session.jwt){
      return  odgovor.json({odgovor: zahtjev.session.jwt})
    }else{
        odgovor.status(401);
        odgovor.send({ greska: "nemam token!" });
    }
    } catch (error) {
        console.log("Greska u provjeri")
    }
    
}
prijava = async function (zahtjev, odgovor) {
    try {
       let greska = ""

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify?secret=6LfOCkUpAAAAACvkg-kLTj8CkCeFcQAicA6O4j38&response='+zahtjev.body.token)
    const data = await response.json();
    console.log(data)
    if(data.score > 0.5){
         if (zahtjev.method == "POST") {
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var totp = zahtjev.body.totp
        console.log("ime: "+korime+" "+"lozinka: "+lozinka)
        var korisnik = await this.auth.prijaviKorisnika(korime, lozinka,totp);
        console.log(korisnik)
        var kor = JSON.parse(korisnik)
        if (korisnik) {
                zahtjev.session.jwt = jwt.kreirajToken(kor,this.tajniKljucJWT)
                jwt.uvijekProvjeriToken(zahtjev.session.jwt,this.tajniKljucJWT)
                zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
                zahtjev.session.korime = korisnik.korime;
                odgovor.status(200);
                odgovor.json({data: "Čovjek ste! Čestitam"})
                
                
            
        } else {
        
            odgovor.status(400)
            odgovor.json({data: "Niste čovjek! >:("})
        }
    }
    } 
    } catch (error) {
        
    }
    
   

   
}


filmoviPretrazivanje = async function (zahtjev, odgovor) {
    let stranica = await ucitajStranicu("filmovi_pretrazivanje");
    odgovor.send(stranica);
}

}

module.exports = HtmlUpravitelj;

async function ucitajStranicu(nazivStranice, poruka = "") {
    let stranice = [ucitajHTML(nazivStranice),
    ucitajHTML("navigacija")];
    let [stranica, nav] = await Promise.all(stranice);
    stranica = stranica.replace("#navigacija#", nav);
    stranica = stranica.replace("#poruka#", poruka)
    return stranica;
}
function ucitajdokumentaciju(){
    return ds.readFile("../../dokumentacija/dokumentacija.html","utf-8")
}
function ucitajHTML(htmlStranica) {
    return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
