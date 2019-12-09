const express = require("express");
const router = express.Router();
var books = require("../data/books");

//const thebooks = require("../books");


router.get("/", async (request, result) => {
    //userBooks = data.usersBooks;
    if (request.session.currentUser) {
        (books ?
            async () => {
                try {
                    let allAuthors = await books.getAllAuthors(request);
                    let allAuthorsObjects = [];
                    for (let i = 0; i < allAuthors.length; i++) {
                        let authorObject = {
                            authorName: allAuthors[i],
                            authorNameNoSpaces: allAuthors[i].replace(/ /g, '')
                        }
                        allAuthorsObjects.push(authorObject);
                    }
                    // console.log(allAuthorsObjects);
                    result.render("pages/allauthors", { allAuthorsObjects });
                } catch (e) {
                    console.log(e);
                    result.sendStatus(404);
                }
            }
            : () => {
                result.render("pages/test");
            })();
    } else {
        result.redirect("/login");
    }

});

module.exports = router;
