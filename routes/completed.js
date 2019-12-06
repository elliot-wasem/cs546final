const express = require("express");
const router = express.Router();
var userBooks = require("../data/usersBooks")

router.get("/", async (request, result) => {
    if (request.session.currentUser) {
        (userBooks?
            async ()=>{
            try {
            let books = await userBooks.getAllCompleted(request);
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

router.post("/:id",async (request, result) =>{
    try{
        console.log(request.body);
        if(!request.body.notes){
            console.log(1);
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