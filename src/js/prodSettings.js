const allow_alerts =  document.getElementById("allow_alerts");
const alertSettings = document.getElementById("alert_settings");
const editSettingsBtn = document.getElementById("edit-settings-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const cancelSettingsBtn = document.getElementById("cancel-settings-btn");
const saveWarningHolder = document.getElementById("save-warning");
let settingsChanged = false;
let changeNotiSetting = [];
let alertsStatus;
let settingsOn = false;
let Product = {};

let new_notification_status;
let new_alert_status;
//INITIAL FUNCTIONS


setTimeout(async() => { // off load get basic product information
   await setBasicProductStats(productId);
   new_alert_status = Product.alertSettings;
}, 200);


// Event Listeners

editSettingsBtn.addEventListener("click", () => {
    if(settingsOn == false) {
        toggleDisabled();
        allowChangesToSettings();
    }
});

cancelSettingsBtn.addEventListener("click", () => {
    cancelBtnClick();
});

saveSettingsBtn.addEventListener("click", async () => {
    // check for changes in form before submitting to db
    if(settingsOn == true && settingsChanged == true) {
        saveChangesToDB(productId);
        toggleDisabled();
        disableSettingChanges();
        showSaveSuccess("Your changes are now in effect!");
    } else if(settingsOn) { // no changes so deny user ability to save
        showSaveWarning("There is nothing here to save. You must make a change before you can save.");
        cancelBtnClick();
    }
});

//FUNCTIONS & METHODS

async function toggleDisabled() {
    alertSettings.disabled = !alertSettings.disabled;
    allow_alerts.disabled = !allow_alerts.disabled;
}

async function disableSettingChanges() {
    editSettingsBtn.classList = "btn btn-info";
    saveSettingsBtn.classList = "displayNone";
    settingsOn = false;
}

async function cancelBtnClick() {
    editSettingsBtn.classList = "btn btn-info";
    cancelSettingsBtn.classList = "displayNone";
    saveSettingsBtn.classList = "displayNone";
    alertSettings.disabled = true;
    allow_alerts.disabled = true;
    settingsOn = false;
}

async function allowChangesToSettings() {
    editSettingsBtn.classList = "displayNone";
    cancelSettingsBtn.classList = "btn btn-info";
    saveSettingsBtn.classList = "btn btn-dark";
    saveWarningHolder.style.outline = "none";
    settingsOn = true;
}

function showSaveWarning(msg) {
    cancelSettingsBtn.classList = "displayNone";
    saveWarningHolder.innerHTML = msg;
    saveWarningHolder.classList = "alert alert-info";
    saveWarningHolder.style.maxWidth = "550px";
    setTimeout(()=> {
        saveWarningHolder.innerHTML = '';
        saveWarningHolder.classList = "displayNone";
    }, 2000);
}

function showSaveSuccess(msg) {
    playSuccessMP3();
    cancelSettingsBtn.classList = "displayNone";
    saveWarningHolder.innerHTML = msg;
    saveWarningHolder.style.maxWidth = "300px";
    saveWarningHolder.classList = "alert alert-success";
    setTimeout(()=> {
        saveWarningHolder.innerHTML = '';
        saveWarningHolder.classList = "displayNone";
    }, 2600);
}

function changeNotificationSettings () {
    settingsChanged = true;
    old_notification_status = Product.alertSettings;
    if(alertSettings.value == "Price Decreases") {
        new_notification_status = "Price Decreases";
    } else if(alertSettings.value== "No Alerts") {
        new_notification_status = "No Alerts";
    } else {
        new_notification_status = "Any Price Change";
    }
    console.log(new_notification_status);
}

function setAlertStatus () {
    settingsChanged = true;
    new_alert_status = !allow_alerts.value;
}


//EFFECTS & ASUDIO
function playSuccessMP3 () {
    var sound = new Howl({
        src: ['../app/mp3/success.mp3']
      });
      
      sound.play();
}



// DB Functions 

async function setBasicProductStats(productId) {
    await database.loadDatabase();
    await database.find({_id: productId}, (err, product) => {
        if(!err){
            Product.id = product[0]._id;
            Product.alertSettings = product[0].alertSettings;
            Product.wantsAlerts = product[0].alerts;
        } else {
            console.log("error loading products from db on click");
        }
    });
}

async function saveChangesToDB(productId) {
     // Set a new price
     await database.update({_id: productId }, { $set: { alerts: new_alert_status} }, {multi:true}, function (err) {
        if(err) console.log(`Error updating : ${err}`);
    });

    // change num checks for testing
    await database.update({_id: productId }, { $set: {alertSettings: new_notification_status } }, {multi:true}, function (err) {
        if(err) console.log(`Error Updating ${err}`);
    });
}