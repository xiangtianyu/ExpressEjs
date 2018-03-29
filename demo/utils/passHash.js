var crypto      = require('crypto');
var staticSalt = require('../config/config').staticSalt;

var passHash = function () {

};

passHash.prototype.getRandomSalt = function (len) {
    //return Math.random().toString(36).substr(2);
    var salt = "";

    var l = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < len; i++) {
        var a = Math.round(Math.random() * 61);
        salt += l[a];
    }

    return salt;
};

passHash.prototype.cryptPwd = function (password, salt) {
    var saltPassword = staticSalt + password + salt;

    var md5 = crypto.createHash('sha256');

    return md5.update(saltPassword).digest('hex');
};

module.exports = passHash;