const KorisnikDAO = require("./korisnikDAO.js");
const jwt = require("jsonwebtoken")

exports.getKorisnici = function (zahtjev, odgovor) {
    try {
        odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let jwtToken = zahtjev.query.jwt
    let jwtTokenDrugi = zahtjev.session.jwt

    if(jwtToken == undefined && jwtTokenDrugi==undefined){
        odgovor.status(401)
            odgovor.json({greska:"Logirajte se"})
    }
    if(jwtToken != undefined){
        console.log(jwtToken)
        let jwt1 = jwt.verify(jwtToken,"ABCD\r")
        if(jwt1.tip_korisnika_id == 1){
            odgovor.status(401)
            odgovor.json({greska:"Nemate pristup"})
        }else if (jwt1.tip_korisnika_id == 2){
          
            kdao.dajSve().then((korisnici) => {
          
             odgovor.send(JSON.stringify(korisnici));
            });  
        }
    }else if(jwtTokenDrugi != undefined){
        console.log(jwtTokenDrugi)
        let jwt2 = jwt.verify(jwtTokenDrugi,"ABCD\r")
        if(jwt2.tip_korisnika_id == 1){
            odgovor.status(401)
            odgovor.json({greska:"Nemate pristup"})
        }else if (jwt2.tip_korisnika_id == 2){
          
            kdao.dajSve().then((korisnici) => {
         
             odgovor.send(JSON.stringify(korisnici));
            });  
        }
    }
    } catch (error) {
        console.log(error)
    }

    
    
}

exports.postKorisnici = function (zahtjev, odgovor) {
    try {
         odgovor.type("application/json")
        let podaci = zahtjev.body;
        let kdao = new KorisnikDAO();
        let jwtToken = zahtjev.query.jwt
        let jwtTokenDrugi = zahtjev.session.jwt
        console.log("PRVI TOKEN : "+jwtToken)
        console.log("DRUGI TOKEN : "+jwtTokenDrugi)
        //----------------------------------------

 if(jwtToken == undefined && jwtTokenDrugi==undefined){
        odgovor.status(401)
            odgovor.json({greska:"Logirajte se"})
    }
    if(jwtToken != undefined){
        let jwt1 = jwt.verify(jwtToken,"ABCD\r")
        if(jwt1.tip_korisnika_id == 1){
            odgovor.status(401)
            odgovor.json({greska:"Nemate pristup"})
        }else if (jwt1.tip_korisnika_id == 2){

            kdao.dodaj(podaci).then((poruka) => {
                odgovor.send(JSON.stringify(poruka));
            });  
           
        }
    }else if(jwtTokenDrugi != undefined){
        let jwt2 = jwt.verify(jwtTokenDrugi,"ABCD\r")
        if(jwt2.tip_korisnika_id == 1){
            odgovor.status(401)
            odgovor.json({greska:"Nemate pristup"})
        }else if (jwt2.tip_korisnika_id == 2){
          
          kdao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
         });  

        }
    }
        //----------------------------------------
        
    } catch (error) {
        console.log(error)
    }
   
}
 

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        console.log(korisnik);
        odgovor.send(JSON.stringify(korisnik));
    });
}

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    try{
        kdao.daj(korime).then((korisnik) => {
        if(korisnik!=null && korisnik.lozinka==zahtjev.body.lozinka && korisnik.totp_enabled == parseInt(zahtjev.body.totp))
            odgovor.send(JSON.stringify(korisnik));
        else{ 
            odgovor.status(401)
            odgovor.send(JSON.stringify({greska: "Krivi podaci!"}))
        }
    });
    }catch(err){
        console.log(err)
    }
    
}

exports.deleteKorisnik = function (zahtjev, odgovor) {
    try {
        odgovor.type("application/json")
    let id = zahtjev.body.korID
    let podaci = zahtjev.params.korime;
    console.log("ID: "+id)
    let kdao = new KorisnikDAO();
    kdao.spremiDnevnikDELETE(id).then((poruka)=>{
    })
    kdao.obrisiFavorite(id).then((poruka)=>{
        console.log("Obrisano")
    })
    kdao.obrisi(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
    } catch (error) {
        console.log("Greska tip 3")
    }
    
}
function dajtotp(){
    let sekvenca = '';
    for (let i = 0; i < 6; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      sekvenca += randomDigit.toString();
    }
    return sekvenca;
  }
exports.totpPost = async function(zahtjev,odgovor){
    try {
       let id = zahtjev.query.id
        let kdao = new KorisnikDAO();
        odgovor.type("application/json")
        let totp = dajtotp()
        kdao.spremiTotp(id,totp).then(t=>{
            odgovor.send(200)
        })
    } catch (error) {
        
    }
}

exports.totpReset = async function(zahtjev,odgovor){
    try {
       let id = zahtjev.query.id
        let kdao = new KorisnikDAO();
        odgovor.type("application/json")
        let totp = dajtotp()
        kdao.resetirajTotp(id).then(t=>{
            odgovor.send(200)
        })
    } catch (error) {
        
    }
}
exports.putKorisnik = async function (zahtjev, odgovor) {
    try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify?secret=&response='+zahtjev.body.token)
    const data = JSON.parse(await response.text());
    console.log(data.score+"Azuriranje data")
    if(data.score > 0.5){
        odgovor.type("application/json")
    let korime = zahtjev.params.korime;
    let podaci = zahtjev.body;
    console.log(podaci)
    let kdao = new KorisnikDAO();
    kdao.spremiDnevnikPUT(podaci).then(poruka=>{
        
    })
    kdao.azuriraj(korime, podaci).then((poruka) => {
        odgovor.status(200);
        odgovor.json({data: "Čovjek ste! Ažuriram vam podatke :)"})
    });
    }else{
        odgovor.json({data: "Niste čovjek! Zabrana ažuriranja podataka >:("})
    }
    
    } catch (error) {
        console.log("Greska tip 4")
    }
   
}