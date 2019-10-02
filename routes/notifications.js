// gkc_hash_code : 01DP3766FK6B4767C2RTCCNZ8K
var notificationsController = require('../controllers/notifications');

var notifications = function (app) {
    app.use('/notifications', notificationsController);
};

module.exports = notifications;
