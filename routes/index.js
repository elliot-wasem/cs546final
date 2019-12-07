const bcrypt = require("bcryptjs");

const homeRoute = require("./home");
const toReadRoute = require("./toread");
const completedRoute = require("./completed");
const detailsRoute = require("./details");
const searchRoute = require("./search");

const thebooks = require("../data/books");
const userBooks = require("../data/usersBooks");

const userData = require("../data/users.js");

const saltRounds = 8;

let myLogger = function (req, res, next) {
    const current_time = new Date().toUTCString();
    const method = req.method;
    const url = req.originalUrl;
    let auth = false;
    if (req.session.currentUser) {
        auth = true;
    }
    console.log("[" + current_time + "]: " + method + " " + url + " Auth: " + auth);
    next();
};

const constructorMethod = app => {
    app.use(myLogger);
    app.use("/toread", toReadRoute);
    app.use("/completed", completedRoute);
    // app.use("/details", detailsRoute);
    app.post("/search", async (request, result) => {
	if (request.session.currentUser) {
	    let searchTerm = request.body.search;

	    try {
		let searchResult = await thebooks.search(searchTerm);
		result.render("pages/home", {books: searchResult, searchWord: searchTerm});
	    } catch (e) {
		result.redirect("/");
	    }
	    
	} else {
	    result.redirect("/login");
	}
    });

    app.get("/book/:book_id", async (request, result) => {
        console.log("book_id: " + request.params.book_id);
        if (request.session.currentUser) {
            console.log("we are authenticated");
            try {
		const book = await thebooks.get(request.params.book_id);
		const userBook = await userBooks.get(request.session.currentUser, request.params.book_id);
		var completed = false;
		var toRead = false;
		if (userBook !== null) {
                    if (userBook.completedBool) {
			completed = true;
                    }
                    else {
			toRead = true;
                    }
		}
		// console.log("book: ", book);
		result.render("pages/book", {book, completed, toRead});
            } catch (e) {
		console.log("bad: " + e);
		result.render("pages/notfound", {});
            }
        } else {
            result.redirect("/login");
        }
    });

    app.post("/addToRead", async (req, res, next) => {
        let bookId = req.body.book_id;
        console.log(bookId);

        if (req.session.currentUser) {
            const userBook = await userBooks.get(req.session.currentUser, req.body.book_id);
            if (userBook == null) {
                try {
                    let insertedBook = await userBooks.create(req.session.currentUser, bookId, false, "");
                    console.log("inserted", insertedBook);
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    let updatedBook = await userBooks.updateCompleted(req.session.currentUser, bookId, false);
                    console.log("updated", updatedBook);
                } catch(e) {
                    console.log(e);
                }
            }
        }

        res.redirect(`/book/${bookId}`);
    });
        
    app.post("/addCompleted", async (req, res, next) => {
        let bookId = req.body.book_id;
        console.log(bookId);
        
        if (req.session.currentUser) {
            const userBook = await userBooks.get(req.session.currentUser, req.body.book_id);
            if (userBook == null) {
                try {
                    let insertedBook = await userBooks.create(req.session.currentUser, bookId, true, "");
                    console.log("inserted", insertedBook);
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    let updatedBook = await userBooks.updateCompleted(req.session.currentUser, bookId, true);
                    console.log("updated", updatedBook);
                } catch(e) {
                    console.log(e);
                }
            }
        }

        res.redirect(`/book/${bookId}`);
    });

    app.get('/badlogin', function(request, response) {
	response.render("pages/badlogin", {});
	return;
    });
    app.get('/login', function(request, response) {
        if (request.session.currentUser == null) {
            response.render("pages/login", {});
        }
        else {
            response.redirect("/");
        }
    });
    app.post('/signup', async (request, response, next) => {
	const username = request.body.username;
	const passwd = request.body.password;
	try {
	    await userData.createUser(username, await bcrypt.hash(passwd, saltRounds));
	    console.log("woohoo");
	    response.redirect("/login");
	} catch (e) {
	    console.log("bad signup: " + e);
	    response.send("badsignup");
	    return;
	}
	return;
    });

    app.post('/login', async function(request, response) {
        const username = request.body.username;
        const passwd = request.body.password;
	let user = undefined;
        try {
	    user = await userData.getByUsername(username);
	} catch (e) {
	    console.log("itsy bitsy spider: " + e);
            response.send("badlogin");
	    return;
	}
        console.log(user);
        if (user) {
	    console.log("ififififififif");
	    let generatedPassword = await bcrypt.hash(passwd, saltRounds);
            const authenticate = await bcrypt.compare(passwd, user.password);
            if (authenticate) {
		console.log("we in boyzzzzzzzzzz");
                request.session.currentUser = user._id;
                response.redirect('/');
            } else {
		console.log("ifnopeifnopeifnopeifnopeifnopeifnope");
                response.render('pages/login', {
                    errorlogin: "401 - You did not provide a valid username and/or password."
                });
		return;
            }
        } else {
	    console.log("nopenopenopenopenopenopenopenope");
            response.render('pages/login', {
                errorlogin: "401 - You did not provide a valid username."
            });
	    return;
        }
    });

    app.post('/register', async function(request, response) {
        let username = request.body.username;
        let password = request.body.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await userData.createUser(username, hashedPassword);

        response.render('pages/login', {
            message: `201 - User ${user} created successfully.`
        });
    });

    app.get('/logout', function(request, response) {
        request.session.currentUser = null;
        response.redirect('/login');
    });

    app.use("/", homeRoute);

    // Was trying to make a 'Page not found' page for /anythingelse
    // app.get('*', function (req, res) {
    //     if (req.session.currentUser) {
    //         res.redirect("/notfound");
    //     } else {
	//     res.redirect("/login");
	//     }
    // });
    // app.get('/notfound', function(req, res) {
    //     if (req.session.currentUser) {
    //         res.render("pages/notfound");
    //     } else {
	//     res.redirect("/login");
	//     }
    // });

    app.all("*", function (req, res, next) {
        if (req.path == '/login' || req.path == '/logout') {
	    next();
            return;
        }

        if (req.session.currentUser) {
            next();
        } else {
            res.redirect("/login");
        }

	return;
    });

    app.get("*", function (req, res, next) {
	res.render("pages/notfound");
	return;
    });    
};

module.exports = constructorMethod;
