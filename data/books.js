const mongoCollections = require("./collections");
const books = mongoCollections.books;
const ObjectId = require('mongodb').ObjectID;

const create = async function create(title, author, genre, keywords) {
    if (!title && !author && !genre && !keywords) {
        throw new Error('Error: All args missing.');
    }
    if (!title || !author || !genre || !keywords) {
        // console.log(title);
        // console.log(author);
        // console.log(genre);
        // console.log(keywords);
        throw new Error('Error: One argument missing. You must provide a title, author, genre, and array of keywords.');
    }
    if (!(typeof title === 'string')) {
        throw new Error('Error: title must be of type String.');
    }
    if (!(typeof author === 'string')) {
        throw new Error('Error: author must be of type String.');
    }
    if (!(typeof genre === 'string')) {
        throw new Error('Error: genre must be of type String.');
    }
    if (!(Array.isArray(keywords))) {
        throw new Error('Error: keywords must be of type Array.');
    }
    for (i = 0; i < keywords.length; i++) {
        if (!(typeof keywords[i] === 'string')) {
            throw new Error('Error: each element of keywords must be of type String.');
        }
    }

    const bookCollection = await books();

    let newBook = {
        title: title,
        author: author,
        genre: genre,
        keywords: keywords
    };

    const insertInfo = await bookCollection.insertOne(newBook);
    if (insertInfo.insertedCount === 0) {
        throw new Error ('Error: Could not create book.');
    }

    const newId = insertInfo.insertedId;

    // const book = await this.get(String(newId));
    return newId;
}

module.exports = { 
    create
}