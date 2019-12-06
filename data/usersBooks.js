const mongoCollections = require("./collections");
const usersBooks = mongoCollections.usersBooks;
const books = mongoCollections.books;
const users = mongoCollections.users;
const usersjs = require("./users");

const ObjectId = require('mongodb').ObjectID;

const get = async function get(userId, bookId) {
    const usersBooksCollection = await usersBooks();

    const info = usersBooksCollection.findOne({userId, bookId});

    return info;
}

const create = async function create(userId, bookId, completedBool, notes) {
    if (userId == null && bookId == null && completedBool == null && notes == null) {
        throw new Error('Error: You must provide a userId, bookId, completedBool, notes.');
    }
    if (userId == null || !bookId == null || completedBool == null || notes == null) {
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
    if (String(bookId).length != 24) {
        throw new Error("Error: Invalid bookId");
    }

    const usersBooksCollection = await usersBooks();

    // Verify that userId/bookId combo does not already exist in the collection
    if (await get(userId, bookId) !== null) {
        throw new Error('Error: Attempt to insert duplicate book for the given user');
    }
    // for (i = 0; i < usersBooksCollection.length; i++) {
    //     if ((ObjectId(userId) === ObjectId(usersBooksCollection[i].userId)) && (ObjectId(bookId) === ObjectId(usersBooksCollection[i].bookId))) {
    //         throw new Error('Error: Attempt to insert duplicate book for the given user');
    //     }
    // }

    let newEntry = {
        userId: userId,
        bookId: bookId,
        completedBool: completedBool,
        notes: notes
    };

    const insertInfo = await usersBooksCollection.insertOne(newEntry);
    if (insertInfo.insertedCount === 0) {
        throw new Error('Error: Could not create book');
    }
    
    const entry = await get(userId, bookId);
    return entry;
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

const updateCompleted = async function(userId, bookId, completed) {
    if (!userId) {
        throw new Error('Error: You must provide a user id to search for.');
    }
    if (!bookId) {
        throw new Error('Error: You must provide a book id to search for.');
    }
    if (completed === undefined) {
        throw new Error('Error: You must provide a completed status.');
    }
    if (!(typeof userId === 'string')) {
        throw new Error('Error: userId must be of type string');
    }
    if (!(typeof bookId === 'string')) {
        throw new Error('Error: userId must be of type string');
    }
    if (!(typeof completed === 'boolean')) {
        throw new Error('Error: completed must be of type boolean');
    }
    if (String(userId).length != 24) {
        throw new Error("Error: Invalid userId");
    }
    if (String(bookId).length != 24) {
        throw new Error("Error: Invalid bookId");
    }

    const usersBooksCollection = await usersBooks();

    const lookup = await usersBooksCollection.findOne({userId: userId, bookId: bookId});

    if (lookup === null) throw `no entry with userId ${userId} and bookId ${bookId}`;

    const newEntry = {
	userId: userId,
	bookId: bookId,
	completedBool: completed,
	notes: lookup.notes
    };

    const updatedInfo = await usersBooksCollection.replaceOne({userId: userId, bookId: bookId}, newEntry);
    if (updatedInfo.modifiedCount === 0) throw "could not update entry";
    return await usersBooksCollection.findOne({userId: userId, bookId: bookId});
};

const updateNotes = async function(userId, bookId, notes) {
    if (!userId) {
        throw new Error('Error: You must provide a user id to search for.');
    }
    if (!bookId) {
        throw new Error('Error: You must provide a book id to search for.');
    }
    //Check if notes is undefined, if it is emptystring then the page should display no notes for the book.
    if (notes===undefined) {
        throw new Error('Error: You must provide notes.');
    }
    if (!(typeof userId === 'string')) {
        throw new Error('Error: userId must be of type string');
    }
    if (!(typeof bookId === 'string')) {
        throw new Error('Error: userId must be of type string');
    }
    if (!(typeof notes === 'string')) {
        throw new Error('Error: notes');
    }
    if (String(userId).length != 24) {
        throw new Error("Error: Invalid userId");
    }
    if (String(bookId).length != 24) {
        throw new Error("Error: Invalid bookId");
    }

    const usersBooksCollection = await usersBooks();

    const lookup = await usersBooksCollection.findOne({userId: userId, bookId: bookId});

    if (lookup === null) throw `no entry with userId ${userId} and bookId ${bookId}`;

    const newEntry = {
	userId: userId,
	bookId: bookId,
	completedBool: lookup.completedBool,
	notes: notes
    };

    const updatedInfo = await usersBooksCollection.replaceOne({userId: userId, bookId: bookId}, newEntry);
    if (updatedInfo.modifiedCount === 0) throw "could not update entry";
    return await usersBooksCollection.findOne({userId: userId, bookId: bookId});
};

const getAllToRead = async function(request, response) {
    const usersBookCollection = await usersBooks();
    const userCollection = await users();
    const bookCollection = await books();

    let userToReadList = [];
    const theBooks = await usersBookCollection.find({}).sort({title: 1}).toArray();
    for (let i = 0; i < theBooks.length; i++) {
        console.log("gonna iterate now");
        //*******//
        //if more than 1 user in db check if it's the current user somehow
        console.log('-------------------- BEFORE IF STATEMENT IN USERSBOOKS ------------------------------');
        console.log(theBooks[i].userId);
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log(request.session.currentUser);
        if (theBooks[i].userId === request.session.currentUser) {
            console.log('-------------------- INSIDE IF STATEMENT IN USERSBOOKS ------------------------------');
            let id = theBooks[i].userId;
            const user = await userCollection.findOne({ _id: ObjectId(id) });
            if (user === null) throw `No user with id ${String(id)}`;

            let bookid = theBooks[i].bookId;
            const book = await bookCollection.findOne({ _id: ObjectId(bookid) });
            if (book === null) throw `No book with id ${String(bookid)}`;
            
            if(theBooks[i].completedBool === false){
                console.log("book count");
                let newbook = {
                    bookid: bookid,
                    title: book.title,
                    author: book.author,
                    notes: theBooks[i].notes,
                };
                userToReadList.push(newbook);
            }
        }
    }
    for(let j=0; j<userToReadList.length; j++){
        console.log("hello book: " + userToReadList[j].title);
    }
    return userToReadList;
};

const getAllCompleted = async function(request) {
    const usersBookCollection = await usersBooks();
    const userCollection = await users();
    const bookCollection = await books();

    let userCompletedList = [];
    const theBooks = await usersBookCollection.find({}).sort({title: 1}).toArray();
    for (let i = 0; i < theBooks.length; i++) {
        console.log("gonna iterate now");
        //*******//
        //if more than 1 user in db check if it's the current user somehow
        if (theBooks[i].userId === request.session.currentUser) {
            let id = theBooks[i].userId;
            const user = await userCollection.findOne({ _id: ObjectId(id) });
            if (user === null) throw `No user with id ${String(id)}`;

            let bookid = theBooks[i].bookId;
            const book = await bookCollection.findOne({ _id: ObjectId(bookid) });
            if (book === null) throw `No book with id ${String(bookid)}`;
            
            if(theBooks[i].completedBool === true){
                console.log("book count");
                let entry = {
                    bookid: bookid,
                    title: book.title,
                    author: book.author,
                    notes: theBooks[i].notes,
                };
                userCompletedList.push(entry);
            }   
        }
    }
    for(let j=0; j<userCompletedList.length; j++){
        console.log("hello book: " + userCompletedList[j].title);
    }
    return userCompletedList;
};


module.exports = {
    get,
    create,
    remove,
    read,
    updateCompleted,
    updateNotes,
    getAllToRead,
    getAllCompleted
};