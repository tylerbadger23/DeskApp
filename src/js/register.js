
submit.addEventListener("click", ()=> {
	getJSONP("welcome.html", function(data){
	    console.log(data[0]);
			console.log("data gotten")
	});
});
