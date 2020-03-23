let Datastore = require("nedb");
let database = new Datastore("producs.db");
database.loadDatabase();