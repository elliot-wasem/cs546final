const express = require("express");
const router = express.Router();
var books = require("../data/books");

//const thebooks = require("../books");


router.get("/:id", async (request, result) => {
    //userBooks = data.usersBooks;
    if (request.session.currentUser) {
        (books?
         async ()=>{
             try {
                console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
                console.log(request.params.id);
                author_name = request.params.id;
                author_name = author_name.replace('%20', ' ');
                console.log(author_name);
                console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
                let byAuthorBooks = await books.getAllByAuthor(request.params.id);
                console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                console.log(byAuthorBooks);
                console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                result.render("pages/byauthor", {authorBooks: byAuthorBooks, name: author_name});
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

// router.post("/:id",async (request, result) =>{
//     try{
//         if(!request.body.notes){
//             request.body.notes="";
//         }
//         await userBooks.updateNotes(request.session.currentUser,request.params.id,request.body.notes);
//         result.status(200).send(request.body.notes);
//     }
//     catch(e){
//         result.status(404).send("failed");
//     }

// });

module.exports = router;