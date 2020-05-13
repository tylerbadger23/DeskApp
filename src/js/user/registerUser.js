let Datastore = require("nedb");
AppUser = new Datastore("appUsr.db");
AppUser.loadDatabase();
let submitBtn = document.getElementById("submit-btn-reg");

setTimeout(() => { // determine if user needs to be logged out
    checkIfAlreadyUser(AppUser)
        .then((userSettings) => {
            if(userSettings.stayesLoggedIn == true) {
                window.location.assign(`landing.html`);
            } else {
                window.location.assign(`login.html`);
            }
    }).catch((err) => {
        // do nothing
        console.log(err);
    })
},100)


submitBtn.addEventListener("click", () => {
    let username = document.getElementById("username");
    let password1 = document.getElementById("password1");
    let password2 = document.getElementById("password2");
    let email = document.getElementById("email");

    if(checkData(username.value, password1.value, password2.value, email.value) == false) return false;

    registerUser(email.value, username.value, password1.value, password2.value)
        .then((response) => { // json data from server
            if(response.err == false) {
                setUserLoggedIn(response);
            } else {
                window.location.assign(`register.html`);
            }
        }).catch((error) => {
            console.log(error);
            window.location.reload();
        })
});


function registerUser (email, username, password1, password2) {
    return new Promise ((resolve, reject)=> {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password1", password1);
        urlencoded.append("password2", password2);
        urlencoded.append("email", email);

        var requestOptions = {
        method: 'POST',
        headers: headers,
        body: urlencoded,
        redirect: 'follow'
        };

        fetch("http://localhost/api/register", requestOptions)
            .then(response => resolve(response.json())) // output response if success
            .catch(error => reject(error)) // outpuit err
    });
}


function checkData(username, password1, password2, email) {
    if(password2.length < 6 || password1.length < 6) return false;
    if(password1 !== password2) return false;
    if(email.length < 6)  return false;
    if(username.length < 4 || username.length > 20) return false;
    return true;
}

async function setUserLoggedIn(response) {
    let usr_username = response.username;
    let usr_email = response.username;
    let usr_id = response.userId;

    await AppUser.loadDatabase();
    await AppUser.insert({
        email: usr_email,
        username: usr_username,
        dateAdded: Date.now(),
        stayesLoggedIn: true,
        userId: usr_id
    }, (err) => {if(err) console.log(`${err}`) });

    window.location.assign(`landing.html`);
}

async function checkIfAlreadyUser(userDB) {
    return new Promise ((resolve, reject) => {
        userDB.find({}, (err, results) => {
            if(!err) {
                if(results.length == 1) {
                    resolve(results[0]);
                } else if(results.length > 1){
                    reject('Multiple accounts found');
                } else {
                  reject(`No user found`);
                }
            }
        })

    });
}
