const books = require ('./books.js');
const connection = require('./connection');
const collection = require('./collections');
const csvtojson = require('csvtojson');
const fs = require('fs');

const convCsvToJson = async function convCsvToJson(filePath) {
    var jsonObjArr = await csvtojson().fromFile(filePath);
    return jsonObjArr;
};


// Write a function that reads the file and returns an array of JSON objects
// Then iterate through the array using a for loop and subscript the JSON objects to get the info needed to create objects to write to the DB
async function buildData() {
    const db = await connection();

    // check if database is built
    // try {
    // 	await db.collection("books").drop();
    // } catch (e) {}
    // try {
    // 	await db.collection("users").drop();
    // } catch (e) {}
    try {
    	await db.collection("usersBooks").drop();
    } catch (e) {}
    return;
    let allBookObjects = await convCsvToJson('./goodbooks-10k/books.csv');
    let bookTags = await convCsvToJson('./goodbooks-10k/book_tags.csv');
    let tags = await convCsvToJson('./goodbooks-10k/tags.csv');

    let i = 0;

    let bookToTags = {};

    for (; i < bookTags.length; i++) {
	if (!bookToTags[bookTags[i].goodreads_book_id]) {
	    bookToTags[bookTags[i].goodreads_book_id] = [];
	}
	bookToTags[bookTags[i].goodreads_book_id].push(tags[bookTags[i].tag_id].tag_name.toString());
    }
    i = 0;

    console.log("Loading database. Give it up to 20 seconds (if working on slow hardware)");
    while (i < allBookObjects.length) {
        try {
            let currBookTagIds = [];
            let currBookTags = bookToTags[allBookObjects[i].goodreads_book_id];

            let newBook = {
                title: allBookObjects[i].original_title,
                author: allBookObjects[i].authors,
                image_url: allBookObjects[i].image_url,
                keywords: currBookTags
            };

            newBook = await books.create(
		allBookObjects[i].original_title ?
		    allBookObjects[i].original_title
		    : allBookObjects[i].title,
		allBookObjects[i].authors ?
		    allBookObjects[i].authors
		    : "Author Not Listed", allBookObjects[i].image_url, currBookTags );
        } catch (e) {
            console.error(e);
        }
        i = i + 1;
    }

    await db.serverConfig.close();
}

module.exports = {
    buildData
};
