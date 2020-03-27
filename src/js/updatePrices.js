let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");
let minute = 60000;
let hour = 3600000;
let halfHour = 1800000;
let fiveMinutes = 300000;
let halfMin = 30000;

async function updateProduct(id, url, price, numChecks, title, wantsAlerts) {
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

            //let priceDif = old_price.split("$")[1] -  new_price.split("$")[1];
            let priceDif = 94.99 -  new_price.split("$")[1];
            console.log(`${priceDif} = Diference in prices`);

            if(priceDif > 0 && wantsAlerts == true) {
                sendNotification(`$${priceDif} Price Drop on Tracked Product!`, `${title}`);
            }
            
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
            consoile.log(err);
        }
    });
    database.find({}, async (err, data) => { // get all products out of db
        if(!err) {
            console.log(data);
            if(data.length < 1) {
                console.log(`Data arr is less then one. no update happened`);
            }
            for(let i = 0; i < data.length; i++) { // for each profuct in products.db update it with function
                updateProduct(data[i]._id, data[i].url, data[i].price, data[i].num_checks, data[i].title, data[i].alerts);
            }
        } else { // error :(
            console.log("fatal error updating product prices");
        }
        
    })
}
let updateInterval = halfMin; //interval for updating data


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
