const mongoCollections = require("./collections");
const books = mongoCollections.books;
const ObjectId = require('mongodb').ObjectID;

const create = async function create(title, author, imageUrl, keywords) {
    if (!title && !author && !imageUrl && !keywords) {
        throw new Error('Error: All args missing.');
    }
    if (!title || !author || !imageUrl || !keywords) {
        throw new Error('Error: One argument missing. You must provide a title, author, imageUrl, and array of keywords.');
    }
    if (!(typeof title === 'string')) {
        throw new Error('Error: title must be of type String.');
    }
    if (!(typeof author === 'string')) {
        throw new Error('Error: author must be of type String.');
    }
    if (!(typeof imageUrl === 'string')) {
        throw new Error('Error: imageUrl must be of type String.');
    }
    if (!(Array.isArray(keywords))) {
        throw new Error('Error: keywords must be of type Array.');
    }

    const bookCollection = await books();

    let newBook = {
        title: title,
        author: author,
        imageUrl: imageUrl,
        keywords: keywords
    };

    const insertInfo = await bookCollection.insertOne(newBook);

    if (insertInfo.insertedCount === 0) {
        throw new Error('Error: Could not create book.');
    }

    const newId = insertInfo.insertedId;

    return newId;
};

module.exports = {
    create
};
