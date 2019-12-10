const express = require("express");
const router = express.Router();
var books = require("../data/books");

//const thebooks = require("../books");


router.get("/:id", async (request, result) => {
    //userBooks = data.usersBooks;
    if (request.session.currentUser) {
        (books ?
            async () => {
                try {
                    const allAuthorsTable = await books.getAllAuthorsTable();
                    let neededName = '';
                    for (let i = 0; i < allAuthorsTable.length; i++) {
                        if (allAuthorsTable[i].authorNameNoSpaces === request.params.id) {
                            neededName = allAuthorsTable[i].authorName;
                        }
                    }
                    let byAuthorBooks = await books.getAllByAuthor(neededName);
                    result.render("pages/byauthor", { authorBooks: byAuthorBooks, name: neededName });
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
