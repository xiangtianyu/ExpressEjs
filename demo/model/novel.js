var mongoose = require('./db');

var novel = mongoose.Schema({
    title: String,
    author: String,
    date: String,
    content: String
});

module.exports = mongoose.model('novel', novel);