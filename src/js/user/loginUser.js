let Datastore = require("nedb");
AppUser = new Datastore("appUsr.db");
AppUser.loadDatabase();

let staysLoggedIn = false;


let loginBtn = document.getElementById("login-btn")

document.getElementById(('login-stay')).addEventListener("click", (e) => {
  staysLoggedIn = !staysLoggedIn;
  console.log(staysLoggedIn);
})

loginBtn.addEventListener ("click", () => { // when user clicks login

  let email = document.getElementById(('login-email')).value;
  let password = document.getElementById(('login-password')).value;

  console.log("sent");
  sendRequestToAPI(email, password, staysLoggedIn)
    .then((responseJson) => {
      if(responseJson.err == false && responseJson.isLoggedIn == true) {
        loginUser(responseJson).then((
            window.location.assign("landing.html?success=true")
        )).catch((err) => {
          showErrMsg(err);
        })
      } else {
        showErrMsg(responseJson);
      }
  }).catch((err) => { // fauilure to send api request
    console.log(err);
  })
})


// API CALLS

function sendRequestToAPI(email, password, staysLoggedIn) {
  return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    urlencoded.append("staysLoggedIn", staysLoggedIn);

    var requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
    redirect: 'follow'
    };

    fetch("http://localhost/api/login", requestOptions)
        .then(response => resolve(response.json())) // output response on success
        .catch(error => reject(error)) // outpuit err
  });
}

function loginUser(jsonResponse) {
  return new Promise((resolve, reject) => {
    AppUser.remove({}, { multi: true }, function (err) { // remove db data if user wants to re-login
      if(err) console.log(err);
    });

    AppUser.insert({email: jsonResponse.email, username: jsonResponse.username, dateAdded: Date.now(), staysLoggedIn: jsonResponse.staysLoggedIn, userId: jsonResponse.serverKey}, (err) => {
      if(err) reject(err);
      if(!err) resolve();
    })
  })
}

function showErrMsg(jsonResponse) {
  console.log(jsonResponse);
}






//
