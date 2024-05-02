const Serija = require('./serijaDAO.js')

exports.insertSerija = function(zahtjev,odgovor){
    odgovor.type("application/json")
    let sdao = new Serija()
    let podaci = zahtjev.body;
    try{
        sdao.spremiDnevnikPOST(podaci).then((poruka)=>{
        })
        sdao.dodaj(podaci).then((poruka) => {
    });
    sdao.dodajFavorti(podaci).then((poruka)=>{
    })
    sdao.dodajSezone(podaci).then((poruka)=>{
        odgovor.status(200)
        odgovor.send(poruka)
    })
    
    }catch(err){
       odgovor.status(200)
    }   
} 
exports.getSerija = function(zahtjev,odgovor){
        try {
            let korisnikID = zahtjev.query.korid
        odgovor.type("application/json")
        let sdao = new Serija()
        sdao.spremiDnevnikGET(korisnikID).then((poruka)=>{

        })
        sdao.dajSveFavorite(korisnikID).then((favoriti)=>{
            odgovor.send(JSON.stringify(favoriti))
        })
        } catch (error) {
            console.log(error)
        }
        

    }
    exports.getSerijaPR = async function(zahtjev,odgovor){
        try {
          let korisnikID = zahtjev.params.korid
        odgovor.type("application/json")
        let sdao = new Serija()
        
        if(zahtjev.session.jwt){
            sdao.spremiDnevnikGET(korisnikID).then((poruka)=>{
            })
            sdao.dajSveFavorite(korisnikID).then((favoriti)=>{
            odgovor.send(JSON.stringify(favoriti))
        })

        }else{
            odgovor.status(401)
            odgovor.send({greska:"Nema tokena"})
            
        }  
        } catch (error) {
            console.log(error)
        }
        
        
    }
    exports.obrisiFavorit = function(zahtjev,odgovor){
        try {
            let serijaID = zahtjev.params.seriaID
        let korID = zahtjev.body.korID
        console.log("Ovo je serija id i korid: "+serijaID+" "+korID)
        odgovor.type("application/json")
        let sdao = new Serija()
        sdao.spremiDnevnikDELETE(korID).then((poruka)=>{
        })
        sdao.obrisi(serijaID,korID).then((poruka)=>{
            odgovor.send(JSON.stringify(poruka))
        })
        } catch (error) {
            console.log("Greska brisanja")
        }
        
        
    }
    exports.dajDnevnik = function(zahtjev,odgovor){
        try {
            let stranica = zahtjev.query.stranica
        let brojpod = zahtjev.query.brojpod
        let poredak = zahtjev.query.poredak
        let sdao = new Serija()
        sdao.dohvatiDnevnik(poredak,stranica,brojpod).then((dnevnici)=>{
            odgovor.send(JSON.stringify(dnevnici))
        })
        } catch (error) {
            
        }
        
    }
exports.getSezona = function(zahtjev,odgovor){
    try {
        let serijaID = zahtjev.query.serijaID
    odgovor.type("application/json")
    let sdao = new Serija()
    sdao.dajSezone(serijaID).then((sezone)=>{
        odgovor.send(JSON.stringify(sezone))
    })
    } catch (error) {
        console.log(error)
    }
    
}