// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var usersController = require('../controllers/users');

var users = function (app) {
    app.use('/users', usersController);
};

module.exports = users;
