const SQLite = require('sqlite3').Database;
const path = require('path');
class Baza {
	constructor(putanjaSQLliteDatoteka) {
		this.putanjaSQLliteDatoteka = path.resolve(__dirname, putanjaSQLliteDatoteka);
    this.vezaDB = new SQLite(this.putanjaSQLliteDatoteka);
		this.vezaDB.exec("PRAGMA foreign_keys = ON;");
	}

    spojiSeNaBazu(){
        try {
            this.vezaDB = new SQLite(this.putanjaSQLliteDatoteka);
		this.vezaDB.exec("PRAGMA foreign_keys = ON;");
        } catch (error) {
            console.log(error)
        }
		
    }
    
    izvrsiUpit(sql, podaciZaSQL, povratnaFunkcija) {
        try {
            this.vezaDB.all(sql, podaciZaSQL, povratnaFunkcija);
        } catch (error) {
            console.log(error)
        }
		
	}
   
    izvrsiUpit(sql,podaciZaSQL){
        try{
            return new Promise((uspjeh,neuspjeh)=>{
            this.vezaDB.all(sql,podaciZaSQL,(greska,rezultat)=>{
                if(greska)
                    console.log("greska");
                else    
                    uspjeh(rezultat);
            });
        });
        }catch(err){
            console.log("Greska u zapisivanju")
        }
         
    }

    zatvoriVezu() {
        try {
            this.vezaDB.close();
        } catch (error) {
            console.log(error)
        }
		
	}
}

module.exports = Baza;
