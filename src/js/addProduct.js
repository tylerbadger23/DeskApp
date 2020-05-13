let cheerio = require('cheerio');
let got = require("got");
let fs = require("fs");
//define elements
let submitBtn = document.getElementById("submitBtn");
let product_name = document.getElementById("product_name");
let alertSettings = document.getElementById("alert_settings");
let product_url = document.getElementById("product_url");

let enableAlerts = false;
database.loadDatabase();
AppUser.loadDatabase();

let User = {};
submitBtn.addEventListener("click", async() => {

    if(check_data_values(product_url.value) == false) { //checkj if errors exist
        requestHTML(product_url.value).then((html) => {
          getProductData(html, product_url.value)
          .then((Product) => {
            addProductToExternalDB(_User, Product) // add product via api call post
              .then((reponse) => {
                playSuccessMP3().then((success) => { // after success sfx return to landing page with
                  // success msg in the url
                  window.location.assign(`landing.html`);
                }).catch((err) => console.log(err)); //  if mp3 fails then throw error
            }).catch((err) => {
              console.log(`${err}`);
            });
          }).catch((err) => {// if error with request then reload the page and allow user to try again
            console.log(err);
            //window.location.assign(`search.html?errorMsg=${err}`);
          });
        }).catch((err) => {
          console.log(err);
          var errMsg = "An invalid url was entered. Make sure its a product on amazon."
          window.location.assign(`search.html?errMsg=${errMsg}`);
        });
    } else {
        product_url.value = "";
        let errMsg = "Invalid url was given to the server";
        window.location.assign(`search.html?err=${errMsg}`);
    }
})

async function getProductData(html, productUrl) {
  // define GLOBAL fuction variables
  let title;
  let price;
  let imageSc;
  // promise whuich will return product information or error
  return new Promise((resolve, reject) =>{
    let productIsActive = false;

    let $ = cheerio.load(html); // load html page
        price = $("#priceblock_ourprice").html(); // price on amazon
        title = $("#productTitle").html().trim(); // timmed title on amazon
        imageSc = $("#landingImage")[0].attribs["data-old-hires"]; // image from amazon

        if(typeof title !== "string" || typeof imageSc !== "string") { // product does not exist
           let errorMsg = 'Product was not found on amazon.';
           window.location.assign(`search.html?errorMsg=${errMsg}`);
        }
        if(typeof price == "string") productIsActive = true;

        let Product = {
            alerts: enableAlerts,
            alertSettings: alertSettings.value,
            title: title,
            price: price,
            url: productUrl,
            img: imageSc,
            isActive: productIsActive
        };

        resolve(Product); // return product after finished
      
  });
}

async function addProductToExternalDB(User, Product) {
  return new Promise ((resolve, reject)=> {
      var headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("alerts", Product.alerts);
      urlencoded.append("alertSettings", Product.alertSettings);
      urlencoded.append("title", Product.title);
      urlencoded.append("price", Product.price);
      urlencoded.append("url", Product.url);
      urlencoded.append("img", Product.img);
      urlencoded.append("isActive", Product.isActive);
      urlencoded.append("userId", User._id);
      urlencoded.append("userEmail", User.email);

      var requestOptions = {
      method: 'POST',
      headers: headers,
      body: urlencoded,
      redirect: 'follow'
      };

      fetch("http://localhost/api/new/product", requestOptions)
          .then(response => resolve(response.json())) // output response if success
          .catch(error => reject(error)) // outpuit err
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
  return new Promise((resolve, reject)=> {
    let sound = new Howl({
        src: ['../app/mp3/success.mp3']
      });

      sound.play();
      setTimeout(()=> {
        resolve();
      }, 300);
  })
}

async function requestHTML(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await got(url);
      resolve(response.body);
    } catch(error) {
      var errMsg = "An invalid url was entered. Make sure its a product on amazon."
      window.location.assign(`search.html?errMsg=${errMsg}`);
    }
  });
}