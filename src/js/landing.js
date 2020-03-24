

async function list_products() {
   

    await database.find({}, (error, data) => { // get * data from db and lost in in data parameter
        if(!error) {
            let row = document.createElement('div');
            for (let i = 0; i < data.length; i++) {
                let itemDiv = document.createElement("a");
                itemDiv.classList.add("list-group-item", "list-group-item-action");
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
        }
        
        
    });
}


list_products();