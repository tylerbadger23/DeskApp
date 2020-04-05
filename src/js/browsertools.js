
async function list_urls() {
    await urls.find({}, (error, data) => { // get * data from db and lost in in data parameter
        if(!error) {

            console.log(data);
            
            let row = document.createElement('div');
            for (let i = 0; i < data.length; i++) {
                let itemDiv = document.createElement("div");
                itemDiv.classList.add("list-group-item", "list-group-item-action", "padding-bottom");
                itemDiv.innerText = data[i].url;
                
                itemDiv.id = data[i]._id.toString();

                row.classList.add("list-group");
                row.appendChild(itemDiv);
                document.getElementById("urls-fill").after(row);
            } 
            console.log('Fetched Data');
        } else {
            console.log(error);
            window.location.assign("404.html");
        }
        
        
    });

    

}

setTimeout(() => { // delay to db loading for config.js
    urls.loadDatabase();
    list_urls();
}, 100);



//define elements 
let submitBtn = document.getElementById("add-url");
let _url = document.getElementById("url-input");


submitBtn.addEventListener("click", async() => {
    if(_url == undefined || _url == null) {
        console.log(_url);
    } else {
        console.log(_url.value);
        add_url (_url.value);
    }

})

function openExtUrl (__url_open) { 
    require('electron').shell.openExternal(__url_open);
}

async function add_url(Url) {
     if(Url.length > 6 ) {
    
        let data = {
            url: Url.toLowerCase(),
            dateAdded: Date.now(),
        };

        urls.insert(data, (err) => {
            if(err) {
                console.log(err);//err
                window.location.assign("browsertools.html?err=true");// rediredcxt aftyer error
            } else {
                console.log("success uploading url");
                window.location.assign("browsertools.html?err=true"); 
            }
        })
    }
}
