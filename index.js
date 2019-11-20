const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const exphbs = require('express-handlebars');

// Cookie stuff
const session = require("express-session");
app.use(session({
  name: "AuthCookie",
  secret: "Secret?",
  resave: false,
  saveUnitialized: true
})); // Create a cookie for the session

app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({}));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});