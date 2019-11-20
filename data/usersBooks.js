const mongoCollections = require("./collections");
const usersBooks = mongoCollections.usersBooks;
const ObjectId = require('mongodb').ObjectID;

const create = async function create(userId, bookId, completedBool, notes) {
    if (!userId && !bookId && !completedBool && !notes) {
        throw new Error('Error: You must provide a userId, bookId, completedBool, notes.');
    }
    if (!userId || !bookId || !completedBool || !notes) {
        throw new Error('Error: One or more arguments missing.');
    }
    if (typeof userId !== 'string') {
        throw new Error('Error: userId must be a string');
    }
    if (typeof bookId !== 'string') {
        throw new Error('Error: bookId must be a string');
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

    // Verify that userId/bookId combo does not already exist in the collection
    for (i = 0; i < usersBooksCollection.length; i++) {
        if ((ObjectId(userId) === ObjectId(usersBooksCollection[i].userId)) && (ObjectId(bookId) === ObjectId(usersBooksCollection[i].bookId))) {
            throw new Error('Error: Attempt to insert duplicate book for the given user');
        }
    }

    let newBook = {
        userId: userId,
        bookId: bookId,
        completedBool: completedBool,
        notes: notes
    };

    const insertInfo = await usersBooksCollection.insertOne(newBook);
    if (insertInfo.insertedCount === 0) {
        throw new Error('Error: Could not create book');
    }

    const newId = insertInfo.insertedId;

    const book = await this.get(String(newId));
    return book;
};

const remove = async function remove(userId, bookId) {
    if (!userId) {
        throw new Error('Error: You must provide a userId to search for.');
    }
    if (!bookId) {
        throw new Error('Error: You must provide a bookId to search for.')
    }
    if (!(typeof userId === 'string')) {
        throw new Error('Error: userId must be of type string');
    }
    if (!(typeof bookId === 'string')) {
        throw new Error('Error: bookId must be of type string');
    }

    if (String(userId).length != 24) {
        throw new Error("Error: Invalid userId");
    }
    if (String(bookId).length != 24) {
        throw new Error("Error: Invalid bookId");
    }

    const usersBooksCollection = await usersBooks();

    const bookToDelete = await usersBooksCollection.findOne({ userId: ObjectId(userId), bookId: ObjectId(bookId)});
    if (bookToDelete === null) {
        throw new Error('Error: Could not delete the entry with the specified userId and bookId');
    }

    const entryToDeleteInfo = usersBooksCollection.removeOne({ userId: ObjectId(userId), bookId: ObjectId(bookId)});

    if (entryToDeleteInfo.deletedCount === 0) {
        throw new Error('Error: Could not delete the entry with the specified userId and bookId');
    }

    let result = {
        'deleted': true,
        'data': bookToDelete
    };

    return result;
};

const read = async function(userId) {
    if (!userId) {
        throw new Error('Error: You must provide an id to search for.');
    }

    if (!(typeof userId === 'string')) {
        throw new Error('Error: id must be of type string');
    }

    if (String(userId).length != 24) {
        throw new Error("Error: Invalid bookId");
    }

    const usersBooksCollection = await usersBooks();

    return await usersBooksCollection.find({userId: userId});
};
