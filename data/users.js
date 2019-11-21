const mongoCollections = require("./collections");
const objectID = require("mongodb").ObjectID;
const users = mongoCollections.users;

async function get(id) {
    if (!id) throw "You must provide an id to search for";

    const userCollection = await users();

    if (String(id).length != 24) throw `Invalid user id`;

    const user = await userCollection.findOne({ _id: objectID(id) });
    if (user === null) throw `No user with id ${String(id)}`;

    return user;
}

async function getByUsername(username) {
    if (!username) throw "You must provide a username to search for";

    const userCollection = await users();

    const user = await userCollection.findOne({ username: username });
    if (user === null) throw `No user with username ${username}`;

    return user;
}

async function isPasswordCorrect(username, hashedPassword) {
    if (!username) throw "must provide a username to create a user";
    if (!hashedPassword) throw "must provide a hashedPassword";
    if (typeof(username) != "string") throw "username must be a string!";
    if (typeof(hashedPassword) != "string") throw "hashedPassword must be a string!";

    const userCollection = await users();

    const user = await userCollection.findOne({username: username});

    if (user === null) return false;

    if (user.password !== hashedPassword) return false;

    return true;
}

async function createUser(username, hashedPassword) {
    if (!username) throw "must provide a username to create a user";
    if (!hashedPassword) throw "must provide a password";
    if (typeof(username) != "string") throw "username must be a string!";
    if (typeof(hashedPassword) != "string") throw "password must be a string!";

    const userCollection = await users();

    const newUser = {
	sessionId: undefined,
	username: username,
	password: hashedPassword
    };

    const doesUserExist = await userCollection.findOne({username: username});

    if (doesUserExist !== null) throw `user with username ${username} exists already`;

    const insertInfo = await userCollection.insertOne(newUser);

    if (await insertInfo.insertedCount === 0) throw "could not insert user into database";

    return await get(insertInfo.insertedId);
}

module.exports = {
    createUser,
    get,
    getByUsername,
    isPasswordCorrect
};
