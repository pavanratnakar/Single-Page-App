"use strict";

var fs = require("fs"),
    async = require("async");

module.exports = function (app) {

    // var LoadPage = function(req, res) {
    //     res.type("html");
    //     res.write("");
    //     async.auto({
    //         Init: function (next) {
    //             next(null, {

    //             });
    //         },
    //         Head: ["Init", function (next) {
    //             res.render("head", {}, next);
    //         }],
    //         Main: ["Init", function (next) {
    //             res.render("body", {}, next);
    //         }],
    //         Tail: ["Init", function (next) {
    //             res.render("tail", {}, next);
    //         }]
    //     }, function (err, html) {
    //         if (err) {
    //             res.write("Error");
    //         } else {
    //             res.write(html.Head + html.Main + html.Tail);
    //         }
    //         res.end();
    //     });
    // };

    // app.get("/", LoadPage);
    app.get("/", function (req, res) {
        res.end(fs.readFileSync("index.html"));
    });
};