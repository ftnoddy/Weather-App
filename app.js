const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/app.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "51c6539659729ced067506e24794cb27"; //weather api key
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      if (weatherData.cod === "404") {
        res.write(`<h1>Sorry, could not find weather data for "${query}"</h1>`);
        res.send();
      } else {
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.write(`
                    <style>
                        body {
                            background-image: url("https://r4.wallpaperflare.com/wallpaper/148/177/244/ultron-marvel-comics-smoke-robot-wallpaper-0b565cad63319f3905d42b09bd5cdc40.jpg");
                            background-repeat: no-repeat;
                            background-size: cover;
                        }
                        h1, p {
                            color: #f5f9f3;
                            text-align: center;
                        }
                        img {
                            display: block;
                            margin: 0 auto;
                        }
                        form {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            padding: 30px;
                            color: #f5f9f3;
                            background: transparent;
                            border: 2px solid rgba(255,255,255,0.5);
                            border-radius: 20px;
                            backdrop-filter: blur(15px);
                        }
                        input {
                            margin-bottom: 10px;
                            padding: 10px;
                        }
                        label {
                            font-weight: bold;
                            margin-right: 10px;
                        }
                        button {
                            margin-bottom: 20px;
                        }
                        button[type="submit"] {
                            background-color: #4caf50;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-top: 10px;
                        }
                        button[type="submit"]:hover {
                            background-color: #3e8e41;
                        }
						.container {
							display: flex;
							flex-direction: column;
							align-items: center;
							padding: 30px;
							color: #f5f9f3;
							background: transparent;
							border: 2px solid rgba(255,255,255,0.5);
							border-radius: 20px;
							backdrop-filter: blur(10px);
							margin: 50px auto;
							max-width: 600px;
							box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
						  }
						  
						  .container img {
							margin: 20px 0;
							width: 100px;
							height: 100px;
						  }
						  
						  .container p {
							margin: 10px 0;
							font-size: 20px;
							font-weight: bold;
							text-align: center;
						  }
						  
						  .container h1 {
							margin-bottom: 20px;
							text-align: center;
							font-size: 40px;
							font-weight: bold;
						  }
						  
						  @media only screen and (max-width: 600px) {
							.container {
							  margin: 20px 0;
							  padding: 20px;
							}
						  
							.container img {
							  width: 80px;
							  height: 80px;
							}
						  
							.container p {
							  font-size: 16px;
							}
						  
							.container h1 {
							  font-size: 30px;
							}
						  }
						  
						  
                    </style>
                   <div class="container">
  <h1>Current Weather in ${weatherData.name}</h1>
  <img src="${imgURL}" alt="${weatherDescription}">
  <p>Temperature: ${temp}&deg;C</p>
  <p>Description: ${weatherDescription}</p>
</div>

                `);
        res.send();
      }
    });
  });
});

app.listen(7777, function () {
  console.log("Server is running in port 7777");
});
