let productId;
let productName = document.getElementById("product-name");
let productPrice = document.getElementById("product-price");
let amazonLink;
let thumbnail = document.getElementById("thumbnail");
let lowestPrice = document.getElementById("lowest-price");
let lastCheckedDate = document.getElementById("last-checked-date");
let updateInterval = 60000; // 60- seconds
let allowAlerts = document.getElementById("allow_alerts");
let alerts;

let selectedField = document.getElementById("alert_settings");

if (window.location.search.indexOf('id') > -1) {
    let searchQuery = window.location.search;
    productId = searchQuery.split("=")[1];
} else {
    alert('Product_ID Not found Error = true');
}


function openExt () { //used to,open page externaly 
    require('electron').shell.openExternal(amazonLink);
}

// main function called when poage loads
async function getProductInformation(qid) { //pass id sent from other page
    await database.loadDatabase();
    await database.find({_id: qid}, (error, data) => { // search db for all data with the qui of id
        if(!error) {
            data = data[0];
            //set data for product page
            productName.innerText = data.title;
            productPrice.innerText =`Price: ${data.price}`;
            thumbnail.src = data.img;
            amazonLink = data.url;
            selectedField.value = data.alertSettings;
            allowAlerts.checked = data.alerts;
            allowAlerts.value = data.alerts;
            lowestPrice = productPrice;
            lastCheckedDate = data.date_last;
            console.log(data);
            alerts = data.alerts;
        } else {
            console.log(error)
            window.location.assign("404.html");
        }
        
    });
}

getProductInformation(productId);

setInterval(()=> {
    getProductInformation(productId);
}, updateInterval);

