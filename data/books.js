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
    
    return theBook;
};
const getAllByAuthor = async function(authorName) {
    if (!authorName) throw "must provide an author name to search for a book";
    if (typeof(authorName) !== 'string') throw "name of author must be a string";
    const bookCollection = await books();

    const booksByAuthor = await bookCollection.find({author: authorName}).toArray();
    
    return booksByAuthor;
};

const getAllByGenre = async function(genre) {
    if (!genre) throw "must provide genre to search for a book";
    if (typeof(genre) !== 'string') throw "genre must be a string";
    
    const bookCollection = await books();

    const theBooks = await bookCollection.find({}).sort({title: 1}).toArray();

    let booksByGenre = [];

    for (let i = 0; i < theBooks.length; i++) {
	let keywords = theBooks[i].keywords;
        for (let j = 0; j < keywords.length; j++) {
            if (keywords[j].toLowerCase().includes(genre)) {
                booksByGenre.push(theBooks[i]);
                break;
            }
	    }
    }
    
    booksByGenre = booksByGenre.sort();

    return booksByGenre;
};

const getAllAuthors = async function() {
    const bookCollection = await books();

    const theBooks = await bookCollection.find({}).sort({title: 1}).toArray();

    let allAuthors = [];

    for (let i = 0; i < theBooks.length; i++) {
        if (!allAuthors.includes(theBooks[i].author)) {
            allAuthors.push(theBooks[i].author);
        }
    }

    allAuthors.sort();
    
    return allAuthors;
};

const getAllAuthorsTable = async function() {
    const bookCollection = await books();
    const theBooks = await bookCollection.find({}).sort({title: 1}).toArray();

    let allAuthorsTable = [];

    for (let i = 0; i < theBooks.length; i++) {
        if (!allAuthorsTable.includes({authorName: theBooks[i].author, authorNameNoSpaces: theBooks[i].author.replace(/ /g, '')})) {
            allAuthorsTable.push({
                authorName: theBooks[i].author,
                authorNameNoSpaces: theBooks[i].author.replace(/ /g, '')});
        }
    }

    allAuthorsTable.sort();
    
    return allAuthorsTable;
}

const getAllGenres = async function() {
    allGenres = ["Biography", "Fantasy", "Fiction","Historical Fiction", "Non-fiction", "Novel", "Science Fiction", "Thriller"];
    return allGenres;
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
    let searchTermWordList = searchTerm.split(' ');
    let searchTermWithDashes = '';
    for (let i = 0; i < searchTermWordList.length; i++) {
        if (i !== searchTermWordList.length - 1) {
            searchTermWithDashes += searchTermWordList[i] + '-';
        } else {
            searchTermWithDashes += searchTermWordList [i];
        }
    }

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
    getAllByAuthor,
    getAllByGenre,
    getAllAuthors,
    getAllGenres,
    getAllAuthorsTable,
    getN,
    get,
    search
};
