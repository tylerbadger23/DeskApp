let cheerio = require('cheerio');
let request = require('request');
let fs = require("fs");

//define elements 
let submitBtn = document.getElementById("submitBtn");
let product_name = document.getElementById("product_name");
let alertSettings = document.getElementById("alert_settings");
let product_url = document.getElementById("product_url");

submitBtn.addEventListener("click", async() => {
    if(check_data_values(product_url.value, product_name.value) == false) { //checkj if errors exist
        console.log("Crawling started");
        await crawl_product_page(product_url.value);
    } else {
        console.log("err so we did not start crawl");
    }
})

async function crawl_product_page(productUrl) {
    request(productUrl, function(err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let price = $("#priceblock_ourprice").html();
            let title = $("#productTitle").html().trim();
            
            let data_arr = {
                title: title,
                price: price,
                url: productUrl,
                user_title: product_name.value,
                date_last: Date.now()
            };

            database.insert(data_arr);
            database.find({}, (err, data)=> {
                if(err) {
                    console.log("Error in db find");
                } else {
                    console.log("successfully grabbed datafrom db");
                    console.log(data);
                }
            });
            window.location.assign("landing.html");
             
      } else {     
        window.location.reload(); 
        console.log(err);
      }
      
    }); 
}

function check_data_values(url, name) {
    let error = false;
    if(url.length == 0 || name.length < 0) { // check url and name lengths 
        errMsg = "parimiter/s is empty";
        console.log(errMsg);
        error = true;
       
    }

    if(localStorage.getItem(name)) { // see if item is already tracked in items array
        errMsg = "item is already tracked.";
        console.log(errMsg);
        error = true;
        
    }

    return error;
}