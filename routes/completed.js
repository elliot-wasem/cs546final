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
