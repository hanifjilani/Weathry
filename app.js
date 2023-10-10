const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const https = require("https")
const nodemailer = require("nodemailer")
require("dotenv").config();

app.use(bodyParser.urlencoded({extended: true}));
// Making the public folder also to be served up when the server is started
app.use(express.static("public"));
app.use(express.static("blog"));
// Setting view engine to ejs
app.set("view-engine", "ejs");
app.set("views", __dirname + "/views")

// If get request is made show index.html

app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html")
})
app.get("/about", function(req,res){
  res.sendFile(__dirname + "/aboutMe.html")
})
app.get("/blog", function(req,res){
  res.sendFile(__dirname + "/blogMainPage.html")
})
app.get("/contact", function(req,res){
  res.sendFile(__dirname + "/contactPage.html")
})
app.get("/privacyPolicy", function(req,res){
  res.sendFile(__dirname + "/privacyPolicy.html")
})
app.get("/termsAndconditions", function(req,res){
  res.sendFile(__dirname + "/termsAndconditions.html")
})
//POST REQUEST
app.post("/contactMe", function(req,res){
  var firstName = req.body.FirstName
  var lastName = req.body.LastName
  var email = req.body.email
  var textarea = req.body.textarea
  console.log(firstName, lastName, email, textarea);
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", //replace with your email provider
  port: 587,
  secureConnection: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  }
});
  transporter.verify(function (error, success) {
    if (error) {
    console.log(error);
    } else {
    console.log("Server is ready to take our messages");
    }
});
const mail = {
      from: email,
      to: process.env.EMAIL,
      subject: `${firstName} ${lastName} has sent message from ${email}`,
      text: `${firstName} ${lastName} has sent message ${textarea}`,
    };

    //3.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).sendFile(__dirname + "/error.html");
      } else {
        res.status(200).sendFile(__dirname + "/success.html");
      }
    });
})

app.post("/", function(req,res){
  const cityName = req.body.CityName
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName+"&appid=" + process.env.APPID +"&units=metric"
  https.get(url, function(response){
    response.on("data", function(data){
      const jsondata = JSON.parse(data)
//Checking if api call is successful or not
      if (jsondata.cod === 200){
        var id = jsondata.weather[0].id.toString();
        const temp = jsondata.main.temp
        const des = jsondata.weather[0].description
        const icon = jsondata.weather[0].icon
        const imageurl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        console.log(jsondata.cod);
        console.log(id);
        if (id[0] === "3" || id[0] === "5"){
      res.render("rain.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id[0] === "2"){
      res.render("thunder.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id === "801" || id === "802" || id === "803" || id === "804"){
      res.render("clouds.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id === "600" || id === "601" || id === "602"){
      res.render("snow.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id[0]==="6"){
      res.render("snowrain.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id ==="701" || id === "741" ){
      res.render("mist.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id ==="771" || id === "781" ){
      res.render("tornado.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id ==="711" || id === "721" || id === "731" || id === "751" || id === "761"){
      res.render("dust.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id ==="800" && icon == "01d" ){
      res.render("clearskyday.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    } else if (id ==="800" && icon == "01n" ){
      res.render("clearskynight.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    }
// if no pair specified matches then go to nopair.ejs
    else {
      res.render("nopair.ejs",{temperature: temp , city: cityName , des: des,icon:icon});
    }
// If cityName is wrong or no cityname is mentioned
    }
    else {
      res.sendFile(__dirname + "/404.html")
    }

    })
  })
})
// Listen PORT 7001
app.listen(process.env.PORT || 7001, function() {
  console.log("Listening on port 7001");
})
