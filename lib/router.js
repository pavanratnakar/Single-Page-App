"use strict";

var fs = require("fs"),
    async = require("async"),
    middleware = require("./middleware.js"),
    config = require("./config.js").cache;

module.exports = function (app) {
    var LoadPage = function(req, res) {
        // pump configs and langs along with request

        res.locals.config = req.config();
        res.locals.context = req.context;
        res.locals.i18n = req.i18n();

        res.type("html");
        res.write("");
        async.auto({
            Init: function (next) {
                next(null, {

                });
            },
            Head: ["Init", function (next) {
                res.render(res.locals.context.device + "/head", {}, next);
            }],
            Main: ["Init", function (next) {
                res.render("general/body", {
                    products: require("../data/products.json")
                }, next);
            }],
            Tail: ["Init", function (next) {
                res.render("general/tail", {}, next);
            }]
        }, function (err, html) {
            if (err) {
                res.write("Error");
            } else {
                res.write(html.Head + html.Main + html.Tail);
            }
            res.end();
        });
    };

    app.get("/dust", middleware.bind(), LoadPage);
    app.get("/", function (req, res) {
        res.type("html");
        res.end(fs.readFileSync("index.html"));
    });
};