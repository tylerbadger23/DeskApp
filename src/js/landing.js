let totalItems = document.getElementById("total-products");

async function list_products() {
   
    await database.find({}, (error, data) => { // get * data from db and lost in in data parameter
        if(!error) {

            if(data.length < 1) {
                totalItems.innerHTML = "You currently have no products being tracked";
            }

            let row = document.createElement('div');
            for (let i = 0; i < data.length; i++) {
                let itemDiv = document.createElement("a");
                itemDiv.classList.add("list-group-item", "list-group-item-action", "padding-bottom");
                itemDiv.innerText = data[i].title;
                itemDiv.href = `product.html?id=${data[i]._id}`;
                
                console.log(data);
                row.classList.add("list-group");
                row.appendChild(itemDiv);

                document.getElementById("products-fill").after(row);
            } 
            console.log('Fetched Data');
        } else {
            console.log(error);
            window.location.assign("404.html");
        }
        
        
    });
}


list_products();