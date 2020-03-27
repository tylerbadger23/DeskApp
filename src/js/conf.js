let Datastore = require("nedb");
database = new Datastore("products.db");
database.loadDatabase();
