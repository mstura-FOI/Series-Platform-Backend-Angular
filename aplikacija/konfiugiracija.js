const ds = require('fs/promises');
class Konfiguracija {
    constructor() { this.konf = {}; }
    dajKonf() {return this.konf; }
    async ucitajKonfiguraciju(){
       
        var podaci = await ds.readFile(process.argv[2],"utf-8");
        this.konf = pretvoriJSONkonfig(podaci)
        
    }
    }
    function pretvoriJSONkonfig(podaci) {
       
        let konf = {};
        var nizPodataka = podaci.split("\n");
            for (let podatak of nizPodataka) {
                var podatakNiz = podatak.split("=");
                var naziv = podatakNiz[0];
                var vrijednost = podatakNiz[1];
                konf[naziv] = vrijednost;
                }
                    return konf;
}
    module.exports = Konfiguracija;