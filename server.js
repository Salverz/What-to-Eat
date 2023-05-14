require("dotenv").config();
const express = require("express");
const app = express();
const session = require('express-session');

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use(function(req, res, next) {
  if (!req.session.user) {
    req.session.user = {
      id: 2,
      location: 70400534
    };
  }
  if (!req.session.data) {
    req.session.data = {
      productData : {}
    };
  }
  next();
});

const index = require('./routers/index');
const ingredients = require('./routers/ingredients');
const locations = require('./routers/locations');
const recipes = require('./routers/recipes');
app.use("/", index);
app.use("/ingredients", ingredients);
app.use("/locations", locations);
app.use("/recipes", recipes);


//start server
app.listen(3000, () => {
    console.log("Expresss server running...")
  });   