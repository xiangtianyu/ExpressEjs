var express = require('express');
var testModel = require('../model/test');
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

module.exports = router;
