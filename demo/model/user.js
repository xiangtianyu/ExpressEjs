var mongoose = require('./db');

var user = mongoose.Schema({
    username: String,
    password: String,
    lastLoginIp: String,
    auth: Number
});

module.exports = mongoose.model('user', user);