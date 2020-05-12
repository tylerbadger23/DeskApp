let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");

//define elements 
let submitBtn = document.getElementById("submitBtn");
let product_name = document.getElementById("product_name");
let alertSettings = document.getElementById("alert_settings");
let product_url = document.getElementById("product_url");

let enableAlerts = false;

submitBtn.addEventListener("click", async() => {
    if(check_data_values(product_url.value) == false) { //checkj if errors exist
        console.log("Crawling started");
        await crawl_product_page(product_url.value);
    } else {
        console.log("err so we did not start crawl");
        product_url.value = "";
        let errMsg = "Invalid url was given to the server";
        window.location.assign(`search.html?err=${errMsg}`);
    }
})

async function crawl_product_page(productUrl) {
    database.loadDatabase();
    request(productUrl, function(err, resp, html) {
        let productIsActive = false;
        if (!err) {
            let $ = cheerio.load(html);
            let title;
            let price;
            let imageSc;
            try { 
            price = $("#priceblock_ourprice").html();
            title = $("#productTitle").html().trim();
            imageSc = $("#landingImage")[0].attribs["data-old-hires"];

            } catch (err) {
                console.log(err);
            } 
            //
            //rsimageSc = imageSc.slice(1, -1);
            // CHECK for price to be set
            if(typeof title !== "string") {
               window.location.assign(`search.html`);
            }
            if(typeof price == "string") productIsActive = true;
            
            
            alertType = alertSettings.value
            let data_arr = {
                alerts: enableAlerts,
                alertSettings: alertType,
                title: title,
                price: price,
                lastKnownPrice: price,
                cheapestPrice: price,
                url: productUrl,
                img: imageSc,
                date_last: Date.now(),
                num_checks: 1, 
                isActive: productIsActive
            };

                database.insert(data_arr);
                playSuccessMP3();
        
        } else {     
           window.location.assign(`search.html?err=true`);
        }
    }); 
}

function check_data_values(url) {
    let error = false;
    if(url.length == 0 || name.length < 0) { // check url and name lengths 
        errMsg = "parimiter/s is empty";
        console.log(errMsg);
        error = true;
       
    }

    return error;
}

function changeCheckBox(element) {
    enableAlerts = !enableAlerts;
    console.log(enableAlerts);
}

async function playSuccessMP3 () {
    var sound = new Howl({
        src: ['../app/mp3/success.mp3']
      });
      
      sound.play();
      setTimeout(()=> {
        window.location.assign(`landing.html`);
      }, 400)
}
