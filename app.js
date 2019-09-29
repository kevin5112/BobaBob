var bodyParser = require("body-parser")
var express = require("express")
var app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))

var port = 3000;
var shops = [
   {name: "Sharetea", image: "Sharetea_logo.png", description: "500 teahouses in 15 countries that import their authentic tea leaves from Taiwan. Stop by a location today and sip share love!"},
   {name: "Kung Fu Tea", image: "KungFuTea_logo.png", description: "Welcome to Kung Fu Tea's Fresh - Innovative - Fearless world of bubble tea (boba) and other tasty, refreshing beverages."}
]

app.get("/", function(req, res) {
	res.render("index")
})

app.get("/shops", function(req, res){
   res.render("shops", {shops:shops})
})

app.get("/shops/new", function(req, res){
   res.render("new.ejs")
})

// 1) Registered businesses can create/modify a single shop
// 2) Admins can create/modify/delete shops
// 3) Businesses must request a shop be deleted from the site
app.post("/shops", function(req, res){
   var name = req.body.name
   var image = req.body.image
   var description = req.body.description
   var newShop = {name: name, image: image, description: description}

   shops.push(newShop)

   res.redirect("/shops")
})

app.listen(port, function(){
   console.log("listening on port: " + port + "...")
})