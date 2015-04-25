"use strict";

var _ = require("lodash");

var defaults = {
        "lang": "en-US",
        "intl": "us"
    },
    intls = {
        "us": ["en-US"],
        "de": ["de-DE"]
    };

module.exports = function(req, res, next) {
    var lang = req.param("lang"),
        intl;

    if (!lang) {
        intl = defaults.intl;
        lang = defaults.lang;
    } else if (!intl) {
        _.some(intls, function (key) {
            if (key.indexOf(lang) !== -1) {
                intl = key;
                return true;
            }
        });
    }
    req.context.lang = lang;
    req.context.intl = intl;

    next();
};