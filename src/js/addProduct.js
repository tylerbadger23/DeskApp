let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");

//define elements 
let submitBtn = document.getElementById("submitBtn");
let product_name = document.getElementById("product_name");
let alertSettings = document.getElementById("alert_settings");
let product_url = document.getElementById("product_url");
let userAlerts = document.getElementById("allow_monitoring");

let enableAlerts = false;

submitBtn.addEventListener("click", async() => {

    if(userAlerts.value == "true" || userAlerts.value == "checked") {
        enableAlerts = true;
    } else {
        enableAlerts = false;
    }



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
    request(productUrl, function(err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let price = $("#priceblock_ourprice").html();
            let title = $("#productTitle").html().trim();
            let imageSc = $("#landingImage")[0].attribs["data-old-hires"];
            //
            //rsimageSc = imageSc.slice(1, -1);
            console.log(imageSc);

            alertType = alertSettings.value

            if(enableAlerts == "false" || enableAlerts == false) {
                alertType = "No Alerts";
            }          
            let data_arr = {
                alerts: enableAlerts,
                alertSettings: alertType,
                title: title,
                price: price,
                cheapestPrice: price,
                url: productUrl,
                img: imageSc,
                date_last: Date.now(),
                num_checks: 1
            };

            if(price == null || title == null) { // error scraping data
                window.location.assign(`search.html?err=true`);
            } else {
                database.insert(data_arr);
                playSuccessMP3();
            }
             
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
    let boxValue = document.getElementById(element).value;
    console.log(boxValue);
    if(boxValue == "false") { //if the value is set
        document.getElementById(element).value =  "true";
    } else {
        document.getElementById(element).value = "false"
    }

    console.log(`Value : ${boxValue}`);
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