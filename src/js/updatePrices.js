let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");
let minute = 60000;
let hour = 3600000;
let halfHour = 1800000;
let fiveMinutes = 300000;
let halfMin = 30000;

let devInterval = 1800000;

async function updateProduct(id, url, price, numChecks, title, wantsAlerts, cheapestEverPrice) {
    let alertsActive = wantsAlerts;
    request(url, async function(err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let new_price = $("#priceblock_ourprice").html();
            let new_num_checks = numChecks + 1;

            /*
            //TEST VARS
            let dev1 = 8;
            let dev2 = 12;
            let dev3 = 16;

            
            if(numChecks >= dev1 && numChecks < dev2) {
                new_price = "$1,099.00"; 
            } else if(numChecks >= dev3) {    
                new_price = "$996.68";
            }
*/
            // check prices and then send notification if user is on
            comparePricesDifferent(cheapestEverPrice, price, new_price, title, id, database);
              

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
    await database.loadDatabase((err)=> {
        if(!err) {
            console.log(`Database loaded`);
        } else {
            console.log(err);
        }
    });
    database.find({}, async (err, data) => { // get all products out of db
        if(!err) {
            console.log(data);
            if(data.length < 1) {
                console.log(`Data arr is less then one. no update happened`);
            }
            for(let i = 0; i < data.length; i++) { // for each profuct in products.db update it with function
                updateProduct(data[i]._id, data[i].url, data[i].price, data[i].num_checks, data[i].title, data[i].alerts, data[i].cheapestPrice);
            }
        } else { // error :(
            console.log("fatal error updating product prices");
        }

    })
}
let updateInterval = devInterval; //interval for updating data


setTimeout(()=> {
    console.log("Init started")
    setInterval(()=> { //update db after every x miliseconds
        startUpdating();
        console.log("Interval started");
    }, updateInterval)
}, 1000)

function sendNotification(header, msg) {
    let myNotification = new Notification(header.toString(), {
        body: msg.toString()
    });

}


async function comparePricesDifferent(cheapestEverPrice, oldPrice, newPrice, prodTitle, prodId, database) {
    let newP = newPrice;
    let oldP = oldPrice;
    let cheapestP = cheapestEverPrice;

    //check for comma
    if(oldPrice.includes(",")) {oldP = oldPrice.replace(/,/g, '');} 
    if(newPrice.includes(",")) {newP = newPrice.replace(/,/g, '');}
    if(cheapestEverPrice.includes(",")) {cheapestP = cheapestEverPrice.replace(/,/g, '');}

    let priceDif = oldP.split("$")[1] - newP.split("$")[1];

    if(priceDif > 0) {
        sendNotification(`$${priceDif} Price Drop on Tracked Product!`, `${prodTitle}`);
        let cheapestDiff = cheapestP.split("$")[1] - newP.split("$")[1]; // check if cheapest ever recorded porice occured
        if(cheapestDiff > 0) {
            await database.update({_id: prodId }, { $set: { cheapestPrice: cheapestEverPrice} }, {multi:true}, function (err) {
                if(err) {
                    console.log(err);
                }
            });
        }

    }
    if(priceDif <= 0) return false;

}

