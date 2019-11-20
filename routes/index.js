const bcrypt = require("bcryptjs");

const homeRoute = require("./home");
const wishRoute = require("./wish");
const completedRoute = require("./completed");
const detailsRoute = require("./details");
const searchRoute = require("./search");

const userData = require("../data/users.js");

const saltRounds = 16;

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
    app.all("*", function (req, res, next) {
        if (req.path == '/login' || req.path == '/logout') {
            return next();
        }

        if (req.session.currentUser) {
            next();
        } else {
            res.redirect("/login");
        }
    });

    app.use(myLogger);
    // app.use("/", homeRoute);
    // app.use("/wish", wishRoute);
    // app.use("/completed", completedRoute);
    // app.use("/details", detailsRoute);
    // app.use("/search", searchRoute);

    app.get('/login', function(request, response) {
        if (request.session.currentUser == null) {
            response.render("pages/login");
        }
        else {
            response.redirect("/");
        }
    });

    app.post('/login', async function(request, response) {
        let username = request.body.username;
        let password = request.body.password;
        var user = userData.getByUser(username);
        
        if (user) {
            const authenticate = await bcrypt.compare(password, user.hashedPassword);
            if (authenticate) {
                request.session.currentUser = user.username;
                response.redirect('/');
            }
            else {
                response.status(401).render('pages/login', {
                    error: "401 - You did not provide a valid username and/or password."
                });
            }
        }
        else {
            response.status(401).render('pages/login', {
                error: "401 - You did not provide a valid username."
            });
        }
    });

    app.post('/register', async function(request, response) {
        let username = request.body.username;
        let password = request.body.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await userData.createUser(username, hashedPassword);

        response.status(201).render('pages/login', {
            message: `201 - User ${user} created successfully.`
        })
    })

    app.get('/logout', function(request, response) {
        request.session.currentUser = null;
        response.redirect('/login')
    });
};

module.exports = constructorMethod;