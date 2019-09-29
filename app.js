var express = require("express")
var app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

var port = 3000;

app.get("/", function(req, res) {
	res.render("index")
})

app.get("/shops", function(req, res){
   res.render("shops")
})

app.listen(port, function(){
   console.log("listening on port: " + port + "...");
})
