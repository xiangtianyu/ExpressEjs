var express = require('express');
var passHash = require('../utils/passHash');
var User = require('../model/user');
var Salt = require('../model/salt');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
  var ph = new passHash();
  var salt = ph.getRandomSalt(16);
  var username = req.body.username;
  var password = req.body.password;
  var passRes = ph.cryptPwd(password, salt);

  User.findOne({username:username}, function (err, docs) {
      if (docs !== null) {
        res.render('register', { title: 'username is used' });
      }
      else {
          var newUser = new User({
              username: username,
              password: passRes
          });

          newUser.save(function(error, user) {
              if (error !== null) {
                  console.error(error);
              }

              var newSalt = new Salt({
                  salt: salt,
                  uid: user._id
              });

              newSalt.save(function(error, salt) {
                  if (error !== null) {
                      console.error(error);
                  }
              });
          });

          res.render('console', { title: 'register success' });
      }
  });

});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
    var ph = new passHash();
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username:username}, function (err, docs) {
        if (docs === null) {
            res.render('login', { title: 'error username' });
        }
        else {
            var pass = docs.password;
            Salt.findOne({uid: docs._id}, function (err, doc) {
                if (docs === null) {
                    res.render('login', { title: 'error salt' });
                }
                var salt = doc.salt;
                var passRes = ph.cryptPwd(password, salt);

                if (passRes === pass) {
                  res.render('console', { title: 'login success' });
                }
                else {
                  res.render('login', { title: 'error password' });
                }
            });
        }
    });

});

module.exports = router;
