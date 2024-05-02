class GitHub{
    constructor(git_client_id,git_client_secret){
        this.id = git_client_id
        this.secret = git_client_secret
        console.log(git_client_id);
		console.log(git_client_secret)
    }
    auth = async function(req,res){
        let id = String(this.id).replace(/\r/g, '');  
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${id}`)
    }
    callback = async function(req,res){
        
        let id = String(this.id).replace(/\r/g, '');  
        let secret = String(this.secret).replace(/\r/g, '');  
            let code = req.query.code;
            console.log("id: "+id)
            console.log("secret: "+secret)
          let podaci =   JSON.stringify({
                client_id: id,
                client_secret: secret,
                code: code,
              })
              console.log(podaci)
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: id,
        client_secret: secret,
        code: code,
    
      }),
    });
    
    const tokenData = await tokenResponse.json();
    console.log(tokenData)
          
    
            const userDataResponse = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              },
            });
          
            const userData = await userDataResponse.json();
          
            console.log('User data from GitHub:', userData);
          
            res.redirect('http://localhost:12479?user_id='+userData.id)
            
            
          }
    }

module.exports = GitHub;