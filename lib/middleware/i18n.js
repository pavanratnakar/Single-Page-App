"use strict";

var fs = require("fs"),
    path = require("path"),
    _ = require("lodash");

var strings = {},
    base = path.join(__dirname, "../../langs");

fs.readdirSync(base).forEach(function (file) {
    var _ext = path.extname(file),
        _name = _ext.toLowerCase() === ".json" && (path.basename(file, _ext).replace(/^strings_?/, "") || "defaults");

    if (_name) {
        strings[_name] = require(path.join(base, file));
    }
});

module.exports = function (req, res, next) {
    req.i18n = function (lang) {
        var translations;
        if (!lang) {
            lang = "defaults";
        }
        if (lang) {
            translations = _.clone(strings[lang], true);
        }
        return translations || _.clone(strings.defaults, true);
    };
    next();
};