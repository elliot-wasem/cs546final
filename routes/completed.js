const express = require("express");
const router = express.Router();
var userBooks = require("../data/usersBooks")

router.get("/", async (request, result) => {
    if (request.session.currentUser) {
        (userBooks?
            async ()=>{
            try {
            let books = await userBooks.getAllCompleted();
            result.render("pages/completed", {books});
            } catch (e) {
            console.log(e)
            result.sendStatus(404);
            }}
            :()=>{
                result.render("pages/test");
            })();
    } else {
        console.log("doesn't work :(");
        result.redirect("/login");
    }
    
});

module.exports = router;