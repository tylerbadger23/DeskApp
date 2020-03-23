

function list_products() {
    let row = document.getElementsByClassName("row");

    database.find({}, (error, data) => { // get * data from db and lost in in data parameter
        if(!error) {
            console.log(data);

            for (let i = 0; i < data.length; i++) {
                const product = data[i];
                let price = product.price;
                let url = product.url;
                let title = product.title;
                let id =  product._id;
                
              
            }

        } else {
            console.log(error);
        }
    });
}


list_products();