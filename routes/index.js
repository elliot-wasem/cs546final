const loginRoute = require("./login");
const logoutRoute = require("./logout");
const homeRoute = require("./home");
const wishRoute = require("./wish");
const completedRoute = require("./completed");
const detailsRoute = require("./details");
const searchRoute = require("./search");

let myLogger = function (req, res, next) {
    const current_time = new Date().toUTCString();
    const method = req.method;
    const url = req.originalUrl;
    let auth = false;
    if (req.session.username) {
        auth = true;
    }
    console.log("[" + current_time + "]: " + method + " " + url + " Auth: " + auth);
    next();
}

const constructorMethod = app => {
    app.use("/", function (req, res, next) {
        if (req.session.id) {
            next();
        } else {
            res.redirect("/login");
        }
    });
    app.use(myLogger);
    app.use("/", homeRoute);
    app.use("/login", loginRoute);
    app.use("/logout", logoutRoute);
    app.use("/wish", wishRoute);
    app.use("/completed", completedRoute);
    app.use("/details", detailsRoute);
    app.use("/search", searchRoute);
};

module.exports = constructorMethod;