var mongoose = require('./db');

var salt = mongoose.Schema({
    salt: String,
    uid: String
});

module.exports = mongoose.model('salt', salt);