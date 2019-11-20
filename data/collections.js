const dbConnection = require("./connection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
<<<<<<< HEAD
  books: getCollectionFn("books"),
  toRead: getCollectionFn("toRead")
};
=======
    books: getCollectionFn("books"),
    users: getCollectionFn("users")
};
>>>>>>> f1cbf761d44beb93b203fafe1f12847092665ab1
