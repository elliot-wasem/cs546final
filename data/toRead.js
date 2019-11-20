const mongoCollections = require("./collections");
const toRead = mongoCollections.toRead;
const ObjectId = require('mongodb').ObjectID;

const create = async function create(userId, bookId, completed_bool, notes) {
    if (!userId && !bookId && !completed_bool && !notes) {
        throw new Error('Error: You must provide a userId, bookId, completed_bool, notes.');
    }
    if (!userId || !myBooks || !completed_bool || !notes) {
        throw new Error('ErrorL: One or more arguments missing.');
    }
    if (typeof userId !== 'string') {
        throw new Error('userId must be a string');
    }
    if (!(Array.isArray(myBooks))) {
        throw new Error('myBooks must be of type array.');
    }
    for (i = 0; i < myBooks.length; i++) {
        if (!(typeof myBooks[i] === 'object')) {
            throw new Error('Each element of myBooks must be an object');
        }
    }

    const toReadCollection = await toRead();

    let newBook = {
        userId: userId,
        booksToRead: myBooks
    }

    const insertInfo = await toReadCollection.insertOne(newBook);
    if (insertInfo.insertedINfo === 0) {
        throw new Error('Error: Could not create book');
    }
}

const remove = async function remove(id) {
    if (!id) {
        throw new Error('Error: You must provide an id to search for.');
    }
    if (!(typeof id === 'string')) {
        throw new Error('Error: id must be of type string');
    }

    const toReadCollection = await toRead();

    const bookToDelete = await toReadCollection.findOne({ _id: ObjectId(id)});

    let result = {
        'deleted': true,
        'data': bookToDelete
    };

    return result;
}