let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");
let minute = 60000;
let hour = 3600000;
let halfHour = 1800000;
let fiveMinutes = 300000;
let halfMin = 30000;

let devInterval = 10000;

async function updateProduct(id, url, price, numChecks, title, wantsAlerts, cheapestEverPrice, isActive) {
    let productIsActive = isActive;
    let productWasActive = isActive;

    request(url, async function(err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let new_price = $("#priceblock_ourprice").html();
            let new_num_checks = numChecks + 1;

            if(typeof new_price == "string") {
                
                // check prices and then send notification if user is on
                if(productIsActive == productWasActive) { // means just changed to active
                    comparePricesDifferent(cheapestEverPrice, price, new_price, title, id, database);
                }

                // change last know price
                await database.update({_id: id }, { $set: { lastKnownPrice: new_price } }, {multi:true}, function (err, numReplaced) {
                    if(!err) {console.log(`Updated ${id} in db num checks ++ ${new_num_checks}`);}
                });

                await database.update({_id: id }, { $set: { price: new_price } }, {multi:true}, function (err, numReplaced) {
                    if(!err) {console.log(`Updated ${id} price in db:  ${new_price}`);}
                });
            } else {
                productIsActive = false; // product is not active
                await database.update({_id: id }, { $set: { price: new_price } }, {multi:true}, function (err, numReplaced) {
                    if(!err) {console.log(`Updated ${id} price in db:  ${new_price}`);}
                });
            }

            // change num checks for testing
            await database.update({_id: id }, { $set: { num_checks: new_num_checks } }, {multi:true}, function (err, numReplaced) {
                if(!err) {console.log(`Updated ${id} in db num checks ++ ${new_num_checks}`);}
            });
            // change num checks for testing
            await database.update({_id: id }, { $set: { date_last: Date.now() } }, {multi:true}, function (err, numReplaced) {
                if(!err) {console.log(`Updated ${id} in db date: ${Date.now()}`);}
            });

            // change num checks for testing
            await database.update({_id: id }, { $set: { isActive: productIsActive } }, {multi:true}, function (err, numReplaced) {
                if(!err) {console.log(`Updated ${id} product's isActive: ${productIsActive}`);}
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
                updateProduct(data[i]._id, data[i].url, data[i].price, data[i].num_checks, data[i].title, data[i].alerts, data[i].cheapestPrice, data[i].isActive);
            }
        } else { // error :(
            console.log("fatal error updating product prices");
        }

    })
}
let updateInterval = devInterval; //interval for updating data


setTimeout(()=> {
    setInterval(()=> { //update db after every x miliseconds
        startUpdating();
        console.log("Init started");
    }, updateInterval + 20000)
}, 1000);

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

