const express = require('express');
const router = express.Router();
const data = require("../data");
const thebooks = require("../data/books");

router.get("/", async (req, res, next) => {
    if (req.session.currentUser) {
	const books = await thebooks.getN(25);
	res.render("pages/home", {books});
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
