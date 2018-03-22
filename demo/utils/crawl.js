var request = require('request');
//var request = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var fs = require("fs");
var novel = require("../model/novel");
var cookie = require("../config/config").zh_cookie;

var ZDS_Crwal = function() {

    this.url = "";
    this.hostname = "";
    this.protocol = "";

    var urlList = [];
    var usedUrl = [];

    var index = 0;

    var pattern = new RegExp("http://book.zongheng.com/chapter/189169/");

    this.init = function (myurl) {
        this.url = myurl;
        this.hostname = url.parse(this.url).hostname;
        this.protocol = url.parse(this.url).protocol;
        urlList.push(this.url);
        this.start();
    };

    this.requestPage = function (src) {
        var _this = this;
        if (this.judgeUrl(src)) {
            request = request.defaults({jar: true});
            var j = request.jar();
            var cookie = request.cookie("logon=" + cookie);
            j.setCookie(cookie, url);
            request({url: src, jar: j}, function (err, res, body) {
                if (err) {
                    usedUrl.push(src);
                    return false;
                }
                usedUrl.push(src);
                _this.processPage(body);
                _this.getAllUrl(body);
            })

            // request
            //     .get(src)
            //     .set('Cookie', 'logon='+cookie)
            //     .end(function(err, res, body){
            //         if (err) {
            //             usedUrl.push(src);
            //             return false;
            //         }
            //         usedUrl.push(src);
            //         _this.processPage(body);
            //         _this.getAllUrl(body);
            //     });
        }
    };

    this.processPage = function (page) {
        var $ = cheerio.load(page);
        var title = $('.txt').find("em").text();
        var contents = $('#readerFs').find("p");
        var content = "";
        contents.each(function () {
            content += '    ' + $(this).text() + "\n\n";
        });

        var newChapter = new novel({
            title: title,
            author: '',
            date: '',
            content: content
        });

        newChapter.save(
            function(error, novel) {
                if (error !== null) {
                    console.error(error);
                    return;
                }
                console.info("Save " + newChapter.title);
            });
    };

    this.getAllUrl = function (page) {
        var $ = cheerio.load(page);
        var a = $('a');
        var _this = this;
        for (var i = 0, len = a.length; i < len; i++) {
            var href = a[i].attribs.href;
            var src = _this.judgeUrl(href);
            if (src && !this.isInUrlList(href)) {
                console.info ('add url:' + href);
                urlList.push(href);
            }
        }
        this.findEnd();
    };

    this.findEnd = function () {
        if (urlList[index]) {
            this.requestPage(urlList[index]);
            index++;
        }
        else {
            console.log("end!");
        }
    };

    this.judgeUrl = function (src) {
        var href = src;
        if (!href) return false;
        if (!pattern.test(href)) return false;
        if (href.match(/(.png|.jpg|.gif|.zip)$/)) return false;
        if (src.match(/^https|^http|^javascript/g)) {
            if (url.parse(src).hostname !== this.hostname) {
                return false;
            }
            else {
                if (!this.isInUsedList(href)) {
                    href = this.protocol + "//" + this.hostname;
                    href += src.match(/^\?/g) ? (this.pathname + src) : src;
                    return href;
                }
            }
        }
    };

    this.isInUsedList = function (src) {
        for (let i = 0; i < usedUrl.length; i++) {
            if (src === usedUrl[i]) {
                return true;
            }
        }
        return false;
    };

    this.isInUrlList = function (src) {
        for (let i = 0; i < urlList.length; i++) {
            if (src === urlList[i]) {
                return true;
            }
        }
        return false;
    };

    this.start = function () {
        this.findEnd();
    }

};

ZDS_Crwal.prototype.startCrawl = function (url) {
    this.init(url);
};

module.exports = ZDS_Crwal;