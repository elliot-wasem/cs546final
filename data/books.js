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

const getAll = async function() {
    const bookCollection = await books();

    const theBooks = await bookCollection.find({}).toArray();
    return theBooks;
};
const getN = async function(numberToGet) {
    if (!numberToGet) throw "must provide a number";
    if (typeof(numberToGet) != 'number') throw `must provide a number. ${numbertoget} is not a number you silly goose`;
    const bookCollection = await books();

    const theBooks = await bookCollection.find({}).sort({author: 1}).limit(numberToGet).toArray();
    return theBooks;
};

module.exports = {
    create,
    getAll,
    getN
};
