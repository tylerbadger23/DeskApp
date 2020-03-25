let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");
let minute = 60000;
let hour = 3600000;
let halfHour = 1800000;
let fiveMinutes = 300000;
let halfMin = 30000;

async function updateProduct(id, url, price, numChecks) {
    let old_price = price;
    let old_num_checks = numChecks;
    request(url, async function(err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let new_price = $("#priceblock_ourprice").html();

            let new_num_checks = numChecks + 1;
            let new_data_arr = {
                price: new_price,
                cheapest_price: new_price,
                date_last: Date.now(),
                num_checks: new_num_checks
            };

           // Set a new price
            await database.update({_id: id }, { $set: { price: new_price } }, {multi:true}, function (err, numReplaced) {
                if(!err) {console.log(`Updated ${id} price in db:  ${numReplaced}`);}
            });

            // change num checks for testing 
            await database.update({_id: id }, { $set: { date_last: Date.now() } }, {multi:true}, function (err, numReplaced) {
                if(!err) {console.log(`Updated ${id} in db date: ${Date.now()}`);}
            });

            // change num checks for testing 
            await database.update({_id: id }, { $set: { num_checks: new_num_checks } }, {multi:true}, function (err, numReplaced) {
                if(!err) {console.log(`Updated ${id} in db num checks ++ ${new_num_checks}`);}
            });
             
      } else {     
        window.location.reload(); 
        console.log(err);
      }
      
    }); 
}

async function startUpdating () { //get all products crwaled
    await database.find({}, async (err, data) => { // get all products out of db
        if(!err) {
            console.log(data);
            if(data.length < 1) {
                console.log(`Data arr is less then one. no update happened`);
            }
            for(let i = 0; i < data.length; i++) { // for each profuct in products.db update it with function
                await updateProduct(data[i]._id, data[i].url, data[i].price, data[i].num_checks);
            }
        } else { // error :(
            console.log("fatal error updating product prices");
        }
        
    })
}
let updateInterval = halfMin; //interval for updating data

setInterval(()=> { //update db after every x miliseconds
    startUpdating();
    console.log("Interval started");
}, updateInterval)