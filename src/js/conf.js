let Datastore = require("nedb");
let database = new Datastore("products.db");
database.loadDatabase();