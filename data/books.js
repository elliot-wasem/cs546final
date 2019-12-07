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

    const theBooks = await bookCollection.find({}).sort({title: 1}).toArray();
    return theBooks;
};
const get = async function(id) {
    if (!id) throw "must provide an id to search for a book";
    if (typeof(id) !== 'string') throw "id of book must be a string";
    if (String(id).length != 24) throw "invalid id format for a book";
    const bookCollection = await books();

    const theBook = await bookCollection.findOne({_id: ObjectId(id)});
    
    console.log("in get, the book is " + theBook);
    return theBook;
};
const getN = async function(numberToGet) {
    if (!numberToGet) throw "must provide a number";
    if (typeof(numberToGet) != 'number') throw `must provide a number. ${numbertoget} is not a number you silly goose`;
    const bookCollection = await books();

    const theBooks = await bookCollection.find({}).sort({author: 1}).limit(numberToGet).toArray();
    return theBooks;
};
const search = async function(searchTerm) {
    if (!searchTerm) throw 'must provide a search term for which to search';
    if (typeof(searchTerm) !== 'string') throw 'search term must be a string';

    searchTerm = searchTerm.toLowerCase();
    searchTermWordList = searchTerm.split(' ');
    console.log(searchTermWordList);
    searchTermWithDashes = '';
    for (let i = 0; i < searchTermWordList.length; i++) {
        if (i !== searchTermWordList.length - 1) {
            searchTermWithDashes += searchTermWordList[i] + '-';
        } else {
            searchTermWithDashes += searchTermWordList [i];
        }
    }
    console.log('==================================================');
    console.log(searchTerm);
    console.log(searchTermWithDashes);
    console.log('==================================================');


    const bookCollection = await books();

    const theBooks = await bookCollection.find({}).sort({title: 1}).toArray();

    let resultBooks = [];

    for (let i = 0; i < theBooks.length; i++) {
	let title = theBooks[i].title;
	let author = theBooks[i].author;
	let keywords = theBooks[i].keywords;
	if (title.toLowerCase().includes(searchTerm)) {
	    resultBooks.push(theBooks[i]);
	} else if (author.toLowerCase().includes(searchTerm)) {
	    resultBooks.push(theBooks[i]);
	} else {
	    for (let j = 0; j < keywords.length; j++) {
		if (keywords[j].toLowerCase().includes(searchTerm) || keywords[j].toLowerCase().includes(searchTermWithDashes)) {
		    resultBooks.push(theBooks[i]);
		    break;
		}
	    }
	}
    }

    return resultBooks;
};

module.exports = {
    create,
    getAll,
    getN,
    get,
    search
};
