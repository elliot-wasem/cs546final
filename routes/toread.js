const express = require("express");
const router = express.Router();
const data = require("../data");
const userBooks = data.usersBooks;

router.get("/", async (request, result) => {
    console.log("testinggg");
    if (request.session.currentUser) {
        console.log("here");
        try {
        let books = await userBooks.getAllToRead();
        result.render("pages/toread", {books});
        } catch (e) {
        result.redirect("/");
        }
        
    } else {
        console.log("doesn't work :(");
        result.redirect("/login");
    }
});

module.exports = router;
  


/*app.get("/toread", async (request, result) => {
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