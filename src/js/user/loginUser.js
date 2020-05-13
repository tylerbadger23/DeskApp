let Datastore = require("nedb");
AppUser = new Datastore("appUsr.db");
AppUser.loadDatabase();
