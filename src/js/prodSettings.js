const allow_alerts =  document.getElementById("allow_alerts");
const alertSettings = document.getElementById("alert_settings");
const editSettingsBtn = document.getElementById("edit-settings-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const cancelSettingsBtn = document.getElementById("cancel-settings-btn");
const saveWarningHolder = document.getElementById("save-warning");
const settingsChangedArr = ["hello"];
let alertsStatus;
let settingsOn = false;
let Product = {};
//INITIAL FUNCTIONS


setTimeout(async() => { // off load get basic product information
   await setBasicProductStats(productId);
   console.log(Product);
}, 200);


// Event Listeners

editSettingsBtn.addEventListener("click", () => {
    if(settingsOn == false) {
        toggelDisabled();
        allowChangesToSettings();
    }
});

cancelSettingsBtn.addEventListener("click", () => {
    cancelBtnClick();
});

saveSettingsBtn.addEventListener("click", async () => {
    if(settingsOn == true && settingsChangedArr.length > 0) {
        toggelDisabled();
        disableSettingChanges();
        showSaveSuccess("Your changes are now in effect!");
    } else if(settingsOn) {
        showSaveWarning("There is nothing here to save. You must make a change before you can save.");
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

function setAlertStatus () {
    let status = allow_alerts.value;
    console.log(status);
    if(alertsStatus == status) return false;
    if(alertsStatus !== status) {

    }
}

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