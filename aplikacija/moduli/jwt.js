const jwt = require("jsonwebtoken")

exports.kreirajToken = function(korisnikJWT, tajniKljucJWT){
	try {
		let token = jwt.sign(korisnikJWT, tajniKljucJWT, { expiresIn: "1h" });
    return token;
	} catch (error) {
		
	}
	
}
exports.uvijekProvjeriToken = function(korisnikJWT,tajniKljucJWT){
	try{
		let podaci = jwt.verify(korisnikJWT,tajniKljucJWT)
	
	return podaci
	}catch{
		console.log("expired")
	}
	
}

exports.provjeriToken = function(zahtjev, tajniKljucJWT) {
	console.log("Provjera tokena: "+zahtjev.headers.authorization);
    if (zahtjev.headers.authorization != null) {
        
        let token = zahtjev.headers.authorization;
        try {
			console.log("------------------------------")
            let podaci = jwt.verify(token, tajniKljucJWT);
            
			return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    return false;
}

exports.ispisiDijelove = function(token){
	let dijelovi = token.split(".");
	let zaglavlje =  dekodirajBase64(dijelovi[0]);
	console.log(zaglavlje);
	let tijelo =  dekodirajBase64(dijelovi[1]);
	console.log(tijelo);
	let potpis =  dekodirajBase64(dijelovi[2]);
	console.log(potpis);
}

exports.dajTijelo = function(token){
	try {
		let dijelovi = token.split(".");
	return JSON.parse(dekodirajBase64(dijelovi[1]));
	} catch (error) {
		
	}
	
}

function dekodirajBase64(data){
	try {
		let buff = new Buffer(data, 'base64');
	return buff.toString('ascii');
	} catch (error) {
		
	}
	
}
