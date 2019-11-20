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
        if (req.session.currentUser) {
            next();
        } else {
            res.redirect("/login");
        }
    });

    app.use(myLogger);
    app.use("/", homeRoute);
    app.use("/wish", wishRoute);
    app.use("/completed", completedRoute);
    app.use("/details", detailsRoute);
    app.use("/search", searchRoute);

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
        var user = null;
      
        for (let i = 0; i < userData.length; i++) {
            if (userData[i].username === username) {
                user = userData[i];
            }
        }
        
        if (user) {
            const authenticate = await bcrypt.compare(password, user.hashedPassword);
            if (authenticate) {
                request.session.currentUser = user._id;
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

    app.get('/logout', function(request, response) {
        request.session.currentUser = null;
        response.redirect('/login')
    });
};

module.exports = constructorMethod;