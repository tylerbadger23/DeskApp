let allow_alerts =  document.getElementById("allow_alerts");
let alertsStatus;



allow_alerts.addEventListener("click", async() => { // run function to update alerts wanted for product to db
await database.loadDatabase((err) => { 
        if(!err) {
            updateAlertStatus(allow_alerts.value, database);
        } else {
            console.log(err);
        }
    });
});


async function updateAlertStatus(alerts, db, productId) {
    db.find({_id: id}, (err, data) => {
        if(!err){
            console.log(data);
        } else {
            console.log("error loading products from db on click");
        }
    })
}