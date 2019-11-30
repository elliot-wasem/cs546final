const express = require("express");
const router = express.Router();
//const data = require("../data");
//var userBooks = data.usersBooks;
var userBooks = require("../data/usersBooks")

//const thebooks = require("../books");


router.get("/", async (request, result) => {
    //userBooks = data.usersBooks;
    console.log("testinggg");
    if (request.session.currentUser) {
        console.log("here" + userBooks);
        (userBooks?
            async ()=>{
            try {
            let books = await userBooks.getAllToRead();
            console.log("books: " + books);
            console.log(JSON.stringify(books, null, 2));
            for (let i=0; i<books.length; i++){
                console.log("book auth:" + books[i].author);
            }
            //const books = await thebooks.getAll();
            result.render("pages/toread", {books});
            } catch (e) {
            console.log(e)
            result.sendStatus(404);
            }}
            :()=>{
                result.render("pages/test");
            })();
        /*
            try {
        let books = await userBooks.getAllToRead();
        //const books = await thebooks.getAll();
        result.render("pages/toread", {books});
        } catch (e) {
        console.log(e)
        result.render("pages/test");
        }
        */
    } else {
        console.log("doesn't work :(");
        result.redirect("/login");
    }
    
});

router.post("/:id",async (request, result) =>{
    try{
        if(!request.body.notes){
            request.body.notes="";
        }
        await userBooks.updateNotes(request.session.currentUser,request.params.id,request.body.notes);
        result.status(200).send(request.body.notes);
    }
    catch(e){
        result.status(404).send("failed")
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