const books = require ('./books.js');
const connection = require('./connection');
const csvtojson = require('csvtojson');
const fs = require('fs');

const convCsvToJson = async function convCsvToJson(filePath) {
    var jsonObjArr = await csvtojson().fromFile(filePath);
    return jsonObjArr;
};


// Write a function that reads the file and returns an array of JSON objects
// Then iterate through the array using a for loop and subscript the JSON objects to get the info needed to create objects to write to the DB
async function main() {
    const db = await connection();

    let allBookObjects = await convCsvToJson('../goodbooks-10k/books.csv');
    let bookTags = await convCsvToJson('../goodbooks-10k/book_tags.csv');
    let tags = await convCsvToJson('../goodbooks-10k/tags.csv');

    console.log('WHAT IS HAPPENING');
    console.log(allBookObjects.length);
    console.log('WHAT IS HAPPENING REALLY COME ON');

    let i = 0;

    while (i < allBookObjects.length) {
        console.log(i);
        try {
            // FOR EVERY BOOK ID, GO INTO BOOK_TAGS.CSV AND GET ALL THE TAG IDS
            // THEN GO INTO TAGS.CSV AND FIND THE TAG ASSOCIATED W EACH TAG ID
            let currBookTagIds = [];
            for (j = 0; j < bookTags.length; j++) {
                if (bookTags[j].goodreads_book_id === allBookObjects[i].goodreads_book_id) {
                    currBookTagIds.push(String(bookTags[j].tag_id));
                }
            }
            let currBookTags = [];
            for (k = 0; k < currBookTagIds.length; k++) {
                for (l = 0; l < tags.length; l++) {
                    if (String(currBookTagIds[k]) === String(tags[l].tag_id)) {
                        currBookTags.push(tags[l]['tag_name'].toString());
                    }
                }
            }

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

main().catch(error => {
    console.log(error);
});
