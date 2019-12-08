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
         let stringName = request.params.id
         stringName = stringName.charAt(0).toUpperCase() + stringName.slice(1);
         if (stringName === 'Historicalfiction') {
            stringName = 'Historical Fiction';
         }
         if (stringName === 'Sciencefiction') {
            stringName = 'Science Fiction';
         }
		 result.render("pages/bygenre", {genreBooks: byGenreBooks, genreName: stringName});
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
