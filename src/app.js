const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const geoCode = require("../utils/geocode");
const openMap = require("../utils/openmap");

// setup handlebards and  view path
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static paths
app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Welcome To Home",
    name: "Hello There",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Hello I am Jitender Node Developer",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Help Page",
    title: "Help Page",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide the address",
    });
  }
  geoCode(req.query.address, (error, { latitude, longitude } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }
    openMap({ latitude, longitude }, (error, response) => {
      if (error) {
        return res.send({
          error,
        });
      }
      return res.send({
        forecast: response.description,
        location: response.location,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("notfound", {
    helpText: "404",
    errorMessage: "Help Article Not Found",
  });
});

app.get("*", (req, res) => {
  res.render("notfound", {
    title: "404",
    errorMessage: "Page Not Found",
  });
});

app.listen(port, () => {
  console.log("server is up and running on port " + port);
});
