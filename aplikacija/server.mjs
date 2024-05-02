import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";
import Konfiguracija from "./konfiugiracija.js";
//import portovi from "/var/www/RWA/2023/portovi.js";
import restKorisnik from "./servis/restKorisnik.js";
import restSerija from "./servis/restSerija.js"
import RestTMDB from "./servis/restTMDB.js";
import HtmlUpravitelj from "./htmlUpravitelj.js";
import FetchUpravitelj from "./fetchUpravitelj.js";
import HtmlUpraviteljDokumentacija from "./htmlUpraviteljDokumentacija.js"
import GitHub from "./git.js";
import exp from "constants";
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const port = portovi.mstura21;
const port = 12479;
const server = express();
import cors from 'cors'
let konf = new Konfiguracija();
konf
	.ucitajKonfiguraciju()
	.then(pokreniServer)
	.catch((greska) => {
		
		if (process.argv.length == 2) {
			console.error("Niste naveli naziv konfiguracijske datoteke!");
		} else {
			console.error("Datoteka ne postoji: " + greska);
		}
	});

function pokreniServer() {
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(cors());
	server.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	  });
	  
	server.use(kolacici());
	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);
	server.use("/", express.static(path.join(__dirname, '../angular')));
	server.use("/login", express.static(path.join(__dirname, '../angular')));
	server.use("/documentation", express.static(path.join(__dirname, '../angular')));
	server.use("/movieDetails", express.static(path.join(__dirname, '../angular')));
	server.use("/movieDetails/:id", express.static(path.join(__dirname, '../angular')));
	server.use("/favourites", express.static(path.join(__dirname, '../angular')));
	server.use("/favourites/:id", express.static(path.join(__dirname, '../angular')));
	server.use("/profile/:id", express.static(path.join(__dirname, '../angular')));
	server.use("/profile", express.static(path.join(__dirname, '../angular')));
	server.use("/dnevnik", express.static(path.join(__dirname, '../angular')));
	server.use("/registration", express.static(path.join(__dirname, '../angular')));
	server.use("/users", express.static(path.join(__dirname, '../angular')));
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../angular/index.html'));
});
server.use('/login',express.static('../angular'))
server.use("/pics", express.static(path.join(__dirname, "../angular/assets")));
	server.use("/js", express.static("./aplikacija/js"));
	pripremiPutanjeSerije();
	pripremiPutanjeKorisnik();
	pripremiPutanjeTMDB();
	pripremiPutanjePocetna();
	pripremiPutanjePretrazivanjeFilmova();
	pripremiPutanjeAutentifikacija();

	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		odgovor.json({ opis: "nema resursa" });
	});
	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}
function pripremiPutanjeSerije(){
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf()["secret_google"],konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let git = new GitHub(konf.dajKonf()["git_client_id"],konf.dajKonf()["git_client_secret"])
	server.post("/dodajSeriju",fetchUpravitelj.dodajSeriju.bind(fetchUpravitelj))
	server.post("/baza/favoriti",restSerija.insertSerija)
	server.get("/dajSerije",fetchUpravitelj.dajSerije.bind(fetchUpravitelj))
	server.get("/dajSezone",fetchUpravitelj.dajSezone.bind(fetchUpravitelj))
	server.get("/baza/favoriti",restSerija.getSerija)
	server.delete("/baza/favoriti/:seriaID",restSerija.obrisiFavorit)
	server.get("/baza/favoriti/:korid",restSerija.getSerijaPR)
	server.get("/baza/korisnikPodaci",fetchUpravitelj.dajPodatkeIzJWT.bind(fetchUpravitelj))
	server.get("/favoriti",htmlUpravitelj.favoriti.bind(htmlUpravitelj))
	server.get("/baza/sezone",restSerija.getSezona)
	server.get('/auth',git.auth.bind(git))
	server.get('/callback', git.callback.bind(git))
}

function pripremiPutanjeKorisnik() {
	server.get("/baza/korisnici", restKorisnik.getKorisnici);
	server.post("/baza/korisnici", restKorisnik.postKorisnici);
	server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
	server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);
	server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);
	server.post(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.getKorisnikPrijava
	);
	server.get('/totp',restKorisnik.totpPost)
	server.get('/totp_reset',restKorisnik.totpReset)
}

function pripremiPutanjeTMDB() {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
	server.get("/baza/tmdb/zanr", restTMDB.getZanr.bind(restTMDB));
	server.get("/baza/tmdb/serije", restTMDB.getSerije.bind(restTMDB));
	server.get("/baza/tmdb/serijeDetalji",restTMDB.getSerijaDetalji.bind(restTMDB))
}

function pripremiPutanjePocetna() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf()["secret_google"],konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let htmlUpraviteljDokumentacija = new HtmlUpraviteljDokumentacija(konf.dajKonf().jwtTajniKljuc)
	server.get("/", htmlUpravitelj.pocetna.bind(htmlUpravitelj));
	server.get(
		"/dajSveZanrove",
		fetchUpravitelj.dajSveZanrove.bind(fetchUpravitelj)
	);
	server.get("/profil",htmlUpravitelj.profil.bind(htmlUpravitelj))
	server.get("/dokumentacija",htmlUpraviteljDokumentacija.dokumentacija.bind(htmlUpraviteljDokumentacija))
	server.get("/dajDvaFilma", fetchUpravitelj.dajDvaFilma.bind(fetchUpravitelj));
	server.get("/dnevnik",htmlUpravitelj.dnevnik.bind(htmlUpravitelj))
	server.get("/baza/dnevnik",restSerija.dajDnevnik)
}

function pripremiPutanjePretrazivanjeFilmova() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf()["secret_google"],konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get(
		"/filmoviPretrazivanje",
		htmlUpravitelj.filmoviPretrazivanje.bind(htmlUpravitelj)
	);
	server.get("/serijaDetalji",htmlUpravitelj.serijaDetalji.bind(htmlUpravitelj))
	server.get("/serijaDetaljiID",fetchUpravitelj.serijaDetalji.bind(fetchUpravitelj))
	server.post(
		"/serijePretrazivanje",
		fetchUpravitelj.serijePretrazivanje.bind(fetchUpravitelj)
	);

}

function pripremiPutanjeAutentifikacija() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf()["secret_google"],konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
	server.post(
		"/registracija",
		htmlUpravitelj.registracija.bind(htmlUpravitelj)
	);

	server.get("/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));
	server.get("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
	server.post("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
    server.get('/baza/korisnici/:korime/prijava', htmlUpravitelj.provjeri.bind(htmlUpravitelj))
	server.get("/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
	server.get(
		"/aktivacijaRacuna",
		fetchUpravitelj.aktvacijaRacuna.bind(fetchUpravitelj)
	);
}
