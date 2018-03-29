var express = require('express');
var testModel = require('../model/test');
var crawl = require('../utils/crawl');
var router = express.Router();

/* test */
router.get('/', function(req, res, next) {
    console.log('start');
    var newInstance = new testModel({
        test: 'test',
        user: 'bjwzds'
    });

    newInstance.save(function(error, test) {
        if (error !== null) {
            console.error(error);
            return;
        }
        res.send({
            "test": test.test,
            "user": test.user
        });
        console.info("Save " + newInstance.user);
    })
});

router.get('/crawl', function(req, res, next) {
    debugger;
    console.info('start');
    var c = new crawl();
    c.startCrawl("http://book.zongheng.com/chapter/189169/3431698.html");
});

router.get('/login', function(req, res, next) {

});

module.exports = router;
