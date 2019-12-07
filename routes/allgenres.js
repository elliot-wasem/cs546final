const express = require("express");
const router = express.Router();
var books = require("../data/books");

//const thebooks = require("../books");


router.get("/", async (request, result) => {
    //userBooks = data.usersBooks;
    if (request.session.currentUser) {
        (books?
         async ()=>{
             try {
		 let allGenres = await books.getAllGenres(request);
		 result.render("pages/allgenres", {allGenres});
             } catch (e) {
		 console.log(e);
		 result.sendStatus(404);
             }}
         :()=>{
             result.render("pages/test");
         })();
    } else {
        result.redirect("/login");
    }
    
});

module.exports = router;
