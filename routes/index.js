const bcrypt = require("bcryptjs");

const homeRoute = require("./home");
const toReadRoute = require("./toread");
const completedRoute = require("./completed");
const detailsRoute = require("./details");
const searchRoute = require("./search");

const thebooks = require("../data/books");
const userBooks = require("../data/usersBooks");

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
};

const constructorMethod = app => {
    app.use(myLogger);
    app.use("/toread", toReadRoute);
    // app.use("/completed", completedRoute);
    // app.use("/details", detailsRoute);
    app.post("/search", async (request, result) => {
	if (request.session.currentUser) {
	    let searchTerm = request.body.search;

	    try {
		let searchResult = await thebooks.search(searchTerm);
		result.render("pages/home", {books: searchResult});
	    } catch (e) {
		result.redirect("/");
	    }
	    
	} else {
	    result.redirect("/login");
	}
    });

    /*
    app.get("/toread", async (request, result) => {
        console.log("whyyy");
        if (request.session.currentUser) {
            console.log("here")
            try {
            let books = await userBooks.getAllToRead();
            result.render("pages/toread", {books});
            } catch (e) {
            result.redirect("/");
            }
            
        } else {
            result.redirect("/login");
        }
    });*/

    app.get("/book/:book_id", async (request, result) => {
	console.log("we doing shit: book_id: " + request.params.book_id);
	if (request.session.currentUser) {
	    console.log("we are authenticated");
	    try {
		const book = await thebooks.get(request.params.book_id);
		console.log("book: " + book);
		result.render("pages/book", {book});
	    } catch (e) {
		console.log("for fucks sake: " + e);
	    }
	} else {
            result.redirect("/login");
	}
    });

    app.get('/login', function(request, response) {
        if (request.session.currentUser == null) {
            response.render("pages/login");
        }
        else {
            response.redirect("/");
        }
    });
    app.post('/signup', async (request, response, next) => {
	const username = request.body.username;
	const passwd = request.body.password;
	try {
	    await userData.createUser(username, await bcrypt.hash(passwd, 16));
	    console.log("woohoo");
	    response.redirect("/login");
	} catch (e) {
	    console.log("fuck");
	    response.render("pages/login", {errorsignup: e});
	    return;
	}
    });

    app.post('/login', async function(request, response) {
	console.log("ffffffffffffffffffffffffffffffff");
        const username = request.body.username;
        const passwd = request.body.password;
        const user = await userData.getByUsername(username);
        console.log(user);
        if (user) {
	    console.log("ififififififif");
	    let generatedPassword = await bcrypt.hash(passwd, 16);
            const authenticate = await bcrypt.compare(passwd, user.password);
            if (authenticate) {
		console.log("we in boyzzzzzzzzzz");
                request.session.currentUser = user.username;
                response.redirect('/');
            } else {
		console.log("ifnopeifnopeifnopeifnopeifnopeifnope");
                response.status(401).render('pages/login', {
                    errorlogin: "401 - You did not provide a valid username and/or password."
                });
            }
        } else {
	    console.log("nopenopenopenopenopenopenopenope");
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
        });
    });

    app.get('/logout', function(request, response) {
        request.session.currentUser = null;
        response.redirect('/login');
    });
    app.use("/", homeRoute);
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

};

module.exports = constructorMethod;
