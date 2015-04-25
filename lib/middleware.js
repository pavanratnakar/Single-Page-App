"use strict";

var fs = require("fs"),
    path = require("path"),
    async = require("async");

var middleware = {},
    base = path.join(__dirname, "middleware");

fs.readdirSync(base).forEach(function(file) {
    var _ext = path.extname(file),
        _name = _ext.toLowerCase() === ".js" && path.basename(file, _ext);

    if (_name) {
        middleware[_name] = require(path.join(base, file));
    }
});

module.exports = {
    bind: function () {
        return function(req, res, next) {
            async.auto({
                Middleware: function (next) {
                    async.each(Object.keys(middleware), function(key, next) {
                        middleware[key](req, res, next);
                    }, next);
                }
            }, next);
        };
    }
};