const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js")
const Autentifikacija = require("./autentifikacija.js");
const { json } = require("stream/consumers");
var idSerije = null
class HtmlUpraviteljDokumentacija {

constructor(tajniKljucJWT){
	this.tajniKljucJWT = "ABCD";
	
	this.auth = new Autentifikacija();
}
	

dokumentacija = async function(zahtjev,odgovor){
    let dok = await ucitajStranicu("dokumentacija")

    odgovor.send(dok)
}

}

module.exports = HtmlUpraviteljDokumentacija;

async function ucitajStranicu(nazivStranice, poruka = "") {
    let stranice = [ucitajHTML(nazivStranice),
    ucitajHTMLnav("navigacija")];
    let [stranica, nav] = await Promise.all(stranice);
    stranica = stranica.replace("#navigacija#", nav);
    stranica = stranica.replace("#poruka#", poruka)
    return stranica;
}
function ucitajHTMLnav(htmlStranica) {
    return ds.readFile(__dirname + "/aplikacija/html/" + htmlStranica + ".html", "UTF-8");
}
function ucitajHTML(htmlStranica) {
    return ds.readFile(__dirname + "/dokumentacija/" + htmlStranica + ".html", "UTF-8");
}
