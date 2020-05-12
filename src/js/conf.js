let Datastore = require("nedb");
database = new Datastore("products.db");
database.loadDatabase();


AppUser = new Datastore("appUsr.db");
AppUser.loadDatabase();

const remote = require('electron').remote;

function quitApp () {
     var window = remote.getCurrentWindow();
     window.close(); 
}

