let Datastore = require("nedb");
database = new Datastore("products.db");
database.loadDatabase();


urls = new Datastore("urls.db");
urls.loadDatabase();