const bcrypt = require("bcryptjs");

const homeRoute = require("./home");
const toReadRoute = require("./toread");
const completedRoute = require("./completed");
const byAuthorRoute = require("./byauthor");
const byGenreRoute = require("./bygenre");
const allAuthorsRoute = require("./allauthors");
const allGenresRoute = require("./allgenres");

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
    app.use("/allauthors", allAuthorsRoute);
    app.use("/allgenres", allGenresRoute);
    app.use("/byauthor", byAuthorRoute);
    app.use("/bygenre", byGenreRoute);
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
        if (request.session.currentUser) {
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
		result.render("pages/book", {book, completed, toRead});
            } catch (e) {
		result.render("pages/notfound", {});
            }
        } else {
            result.redirect("/login");
        }
    });

    app.post("/addToRead", async (req, res, next) => {
        let bookId = req.body.book_id;

        if (req.session.currentUser) {
            const userBook = await userBooks.get(req.session.currentUser, req.body.book_id);
            if (userBook == null) {
                try {
                    let insertedBook = await userBooks.create(req.session.currentUser, bookId, false, "");
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    let updatedBook = await userBooks.updateCompleted(req.session.currentUser, bookId, false);
                } catch(e) {
                    console.log(e);
                }
            }
        }

        res.redirect(`/book/${bookId}`);
    });
        
    app.post("/addCompleted", async (req, res, next) => {
        let bookId = req.body.book_id;
        
        if (req.session.currentUser) {
            const userBook = await userBooks.get(req.session.currentUser, req.body.book_id);
            if (userBook == null) {
                try {
                    let insertedBook = await userBooks.create(req.session.currentUser, bookId, true, "");
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    let updatedBook = await userBooks.updateCompleted(req.session.currentUser, bookId, true);
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
	    response.redirect("/login");
	} catch (e) {
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
            response.send("badlogin");
	    return;
	}
        if (user) {
	    let generatedPassword = await bcrypt.hash(passwd, saltRounds);
            const authenticate = await bcrypt.compare(passwd, user.password);
            if (authenticate) {
                request.session.currentUser = user._id;
                response.redirect('/');
            } else {
		response.send("badlogin");
		return;
            }
        } else {
            response.send("badlogin");
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
