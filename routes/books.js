// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var booksController = require('../controllers/books');

var books = function (app) {
    app.use('/books', booksController);
};

module.exports = books;
