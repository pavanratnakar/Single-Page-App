"use strict";

var _ = require("lodash"),
    config = require("../config.js").cache;

var defaults = {
        "lang": "en-US",
        "intl": "us"
    },
    intls = config.intls;

module.exports = function(req, res, next) {
    var lang = req.param("lang"),
        intl;

    if (!lang) {
        intl = config.defaults.intl;
        lang = config.defaults.lang;
    } else if (!intl) {
        _.some(intls, function (value, index) {
            if (value.indexOf(lang) !== -1) {
                intl = index;
                return true;
            }
        });
    }
    req.context.lang = lang;
    req.context.intl = intl;

    next();
};