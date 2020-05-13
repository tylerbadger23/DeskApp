let Datastore = require("nedb");
database = new Datastore("products.db");
database.loadDatabase();

let _User = {};

AppUser = new Datastore("appUsr.db");
AppUser.loadDatabase();



const remote = require('electron').remote;

function quitApp () {
     var window = remote.getCurrentWindow();
     window.close();
}

async function getUser(AppUser) {
  await AppUser.find({}, (err, data) => {
    if(data.length == 1) {
      _User._id = data[0]._id;
      _User.username = data[0].username;
      _User.email = data[0].email;
    } else {
      window.location.assign(`login.html`);
    }
  });
}

getUser(AppUser);
