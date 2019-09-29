var express = require("express")
var app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

var port = 3000;

app.get("/", function(req, res) {
	res.render("index")
})

app.get("/shops", function(req, res){
   var shops = [
      {name: "Sharetea", image: "Sharetea_logo.png", description: "500 teahouses in 15 countries that import their authentic tea leaves from Taiwan. Stop by a location today and sip share love!"},
      {name: "Kung Fu Tea", image: "KungFuTea_logo.png", description: "Welcome to Kung Fu Tea's Fresh - Innovative - Fearless world of bubble tea (boba) and other tasty, refreshing beverages."}
   ]
   res.render("shops", {shops:shops})
})

app.listen(port, function(){
   console.log("listening on port: " + port + "...");
})
