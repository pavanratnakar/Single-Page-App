"use strict";

var fs = require("fs"),
    path = require("path"),
    _ = require("lodash"),
    async = require("async"),
    dust = require("dustjs-helpers");

var cache = {},
    base = path.join(__dirname, "../templates");

async.series([
    function(next) {
        var helpers = path.join(__dirname, "dust-helpers");
        async.each(fs.readdirSync(helpers), function (file, next) {
            var _ext = path.extname(file);
            if (_ext.toLowerCase() === ".js") {
                require(path.join(helpers, file))(dust);
            }
            next();
        }, next);
    },
    function(next) {
        (function _compile(dir, next) {
            async.each(fs.readdirSync(dir), function(file, next) {
                var workPath = path.join(dir, file),
                    stats = fs.statSync(workPath);

                if (stats.isDirectory()) {
                    return _compile(workPath, next);
                }

                var _ext = path.extname(file),
                    _name = _ext.toLowerCase() === ".dust" && path.basename(file, _ext),
                    _pre = path.relative(base, dir);

                if (!_name) {
                    return next();
                }

                if (_pre) {
                    _name = _pre + "/" + _name;
                }
                fs.readFile(workPath, "utf8", function (err, content) {
                    if (!err) {
                        cache[_name] = dust.compileFn(content, _name);
                    }
                    next();
                });
            }, next);
        }(base, next));
    }
]);

module.exports = function(template, options, callback) {
    var _name = path.relative(base, template).replace(/\.dust$/i, "");

    try {
        var tmpl = cache[_name];
        if (typeof tmpl !== "function") {
            return callback("Template [" + _name + "] not found");
        }
        tmpl(options, callback);
    } catch (err) {
        callback(err);
    }
};