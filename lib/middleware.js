"use strict";

var fs = require("fs"),
    path = require("path"),
    async = require("async"),
    config = require("./config.js");

var contextualizers = {},
    middleware = {},
    base = path.join(__dirname, "contextualizers");

fs.readdirSync(base).forEach(function(file) {
    var _ext = path.extname(file),
        _name = _ext.toLowerCase() === ".js" && path.basename(file, _ext);

    if (_name) {
        contextualizers[_name] = require(path.join(base, file));
    }
});

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
        return function (req, res, next) {
            if (!req.context) {
                req.context = {};
            }
            async.auto({
                MasterConfig: function (next) {
                    config.master(req, res, next);
                },
                Contextualizers: ["MasterConfig", function (next) {
                    async.each(Object.keys(contextualizers), function (key, next) {
                        contextualizers[key](req, res, next);
                    }, next);
                }],
                Middleware: ["Contextualizers", function (next) {
                    async.each(Object.keys(middleware), function (key, next) {
                        middleware[key](req, res, next);
                    }, next);
                }],
                CompleteConfig: ["Contextualizers", function (next) {
                    config.final(req, res, next);
                }]
            }, next);
        };
    }
};