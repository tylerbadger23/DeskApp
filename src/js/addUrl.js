
//define elements 
let submitBtn = document.getElementById("add-url");
let _url = document.getElementById("url-input").innerHTML;


submitBtn.addEventListener("click", async() => {
    if(_url == undefined || _url == null) {
        console.log(_url);
    } else {
        console.log(_url);
        add_url (_url);
    }

})

async function add_url(Url) {
     if(Url.length > 6 ) {
        console.log(`Length Not higher than desired length. ${Url.length} = current length`);  
    
        let data = {
            url: Url.toLowerCase(),
            dateAdded: Date.now(),
        };

        URLSearchParams.insert(data, (err) => {
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
