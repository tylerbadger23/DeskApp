let Datastore = require("nedb");
database = new Datastore("products.db");
database.loadDatabase();


urls = new Datastore("urls.db");
urls.loadDatabase();

const remote = require('electron').remote;

function quitApp () {
     var window = remote.getCurrentWindow();
     window.close(); 
}

