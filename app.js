const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');//to get text from form
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
app.listen(3000,function(){console.log("Server running on port 3000");})

app.get("/",function(req,res) {
    res.sendFile(__dirname+"/index.html");//sends html when homepage(/) is requested
})

app.post("/",function(req,res)//to recieve data from post request
{
    const query=req.body.cityName;
    const units = "metric";
    https.get("https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid=<apikey>&units="+units,function(response)
    {
        console.log(response.statusCode+" New request");
        response.on("data",function(data) //data from response sent by url //When you make an HTTP request using https.get(), the response is received as a stream of data that arrives in multiple chunks.By registering the data event handler, you can accumulate the received data by appending each chunk to a variable, here data
        {
            const weatherData = JSON.parse(data);//convert that data to json
            // res.write("<h1>Temperature of "+query+" is "+weatherData.main.temp+"</h1>");//send the converted data back to website
            // res.write("<img src='https://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png'>")   
            res.render("display",{city:query,src:"https://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png",temp:weatherData.main.temp,pressure:weatherData.main.pressure,humidity:weatherData.main.humidity,temp_max:weatherData.main.temp_max,temp_min:weatherData.main.temp_min});
        })
    })    
})
