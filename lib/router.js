"use strict";

var fs = require("fs"),
    path = require("path"),
    async = require("async");

module.exports = function (app) {
    app.get("/", function(req, res){
        res.end(fs.readFileSync("index.html"));
    });
};