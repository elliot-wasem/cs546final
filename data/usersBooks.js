const mongoCollections = require("./collections");
const usersBooks = mongoCollections.usersBooks;
const ObjectId = require('mongodb').ObjectID;

const create = async function create(userId, bookId, completed_bool, notes) {
    if (!userId && !bookId && !completed_bool && !notes) {
        throw new Error('Error: You must provide a userId, bookId, completedBool, notes.');
    }
    if (!userId || !myBooks || !completed_bool || !notes) {
        throw new Error('Error: One or more arguments missing.');
    }
    if (typeof userId !== 'string') {
        throw new Error('Error: userId must be a string');
    }
    if (typeof completedBool !== 'boolean') {
        throw new Error('Error: completedBool must be of boolean');
    }
    if (typeof notes !== 'string') {
        throw new Error('Error: notes must be of type string');
    }

    if (String(userId).length != 24) {
        throw new Error('Error: Invalid userId');
    }
    if (String(id).length != 24) {
        throw new Error("Error: Invalid bookId");
    }

    const usersBooksCollection = await usersBooks();

    let newBook = {
        userId: userId,
        bookId: bookId,
        completed_bool: completed_bool,
        notes: notes
    }

    const insertInfo = await toReadCollection.insertOne(newBook);
    if (insertInfo.insertedCount === 0) {
        throw new Error('Error: Could not create book');
    }

    const newId = insertInfo.insertedId;

    
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