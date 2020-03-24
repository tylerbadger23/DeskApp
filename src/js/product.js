let productId;
let productName = document.getElementById("product-name");
let productPrice = document.getElementById("product-price");
let amazonLink;
let lowestPrice = document.getElementById("lowest-price");
let lastCheckedDate = document.getElementById("last-checked-date");

if (window.location.search.indexOf('id') > -1) {
    let searchQuery = window.location.search;
    productId = searchQuery.split("=")[1];
} else {
    alert('Product_ID Not found Error = true');
}
getProductInformation(productId);
    

function openExt () {
    require('electron').shell.openExternal(amazonLink);
}

// main function called when poage loads
async function getProductInformation(qid) { //pass id sent from other page
    
    await database.find({_id: qid}, (error, data) => { // search db for all data with the qui of id
        if(!error) {
            data = data[0];
            //set data for product page
            productName.innerText = data.title;
            productPrice.innerText =`Price: ${data.price}`;
            amazonLink = data.url;
            lowestPrice = productPrice;
            lastCheckedDate = data.date_last;
            console.log(data);
        } else {
            console.log(error)
        }
        
    });
}