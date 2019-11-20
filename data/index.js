const books = require ('./data/books.js');
const connection = require('./data/connection');

const csv = require('csv-parser');
const csvtojson = require('csvtojson');
const jsontocsv = require('json2csv');
const fs = require('fs');




const readCsv_orig = function readCsv_orig(fileName) {
    let jsonObjArr = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (row) => {
        //   console.log(row);
          jsonObjArr.push(row);
        //   console.log(jsonObjArr);
      });
    //   .on('end', () => {
    //       console.log('CSV file successfully processed');
    // });
    return jsonObjArr;
}

const readCsv = function readCsv(fileName) {
    let myArr = [];
    csvtojson().fromFile(fileName).then(source => {
        // console.log(source);
        myArr = source;
        return myArr;
    });
    // return myArr;
}

const convCsvToJson = async function convCsvToJson(filePath) {
    var jsonObjArr = await csvtojson().fromFile(filePath)
    return jsonObjArr;
}


// Write a function that reads the file and returns an array of JSON objects
// Then iterate through the array using a for loop and subscript the JSON objects to get the info needed to create objects to write to the DB
async function main() {
    const db = await connection();

    let allBookObjects = await convCsvToJson('books.csv');
    let bookTags = await convCsvToJson('book_tags.csv');
    let tags = await convCsvToJson('tags.csv');

    console.log('WHAT IS HAPPENING');
    console.log(allBookObjects.length);
    console.log('WHAT IS HAPPENING REALLY COME ON');

    let i = 0;

    while (i < allBookObjects.length) {
        console.log(i);
        // let newBook = undefined;
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
                    console.log('-----CURR BOOK TAGS-----');
                    console.log(currBookTagIds[k]);
                    console.log('-----TAGS-----')
                    console.log(tags[l]);
                    if (String(currBookTagIds[k]) === String(tags[l].tag_id)) {
                        console.log('Condition met');
                        currBookTags.push(tags[l]);
                    } else {
                        console.log('Help me');
                    }
                }
            }
            newBook = {
                title: allBookObjects[i].original_title,
                author: allBookObjects[i].authors,
                genre: 'some genre',
                keywords: currBookTags
            }

            // newBook = await books.create(allBookObjects[i].original_title, allBookObjects[i].authors, 'some genre', ['list', 'of', 'words']);
            console.log('~~~~~~~~~~~~~~~~~~~~');
            console.log(newBook);
            console.log('~~~~~~~~~~~~~~~~~~~~');
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
