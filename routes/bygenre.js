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
		 let byGenreBooks = await books.getAllByGenre(request.params.id);
		 result.render("pages/bygenre", {genreBooks: byGenreBooks, genreName: request.params.id});
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
