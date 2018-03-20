var mongoose = require('./db');

var test = mongoose.Schema({
    test: String,
    user: String
});

module.exports = mongoose.model('test', test);