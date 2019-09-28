var express = require("express")
var app = express();

app.set("view engine", "ejs");

var port = 3000;

app.listen(port, function(){
   console.log("listening on port: " + port + "...");
})
