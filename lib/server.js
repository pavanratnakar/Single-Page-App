"use strict";

var express = require("express"),
	compression = require("compression"),
	path = require("path"),
	renderer = require("./renderer.js");

var app = express(),
	http = require("http").createServer(app);

app.engine("dust", renderer);
app.set("views", path.join(__dirname, "../templates"));
app.set("view engine", "dust");

app.set("port", 8001);

app.use("/dist", express.static(path.join(__dirname , "../dist")));
app.use("/data", express.static(path.join(__dirname , "../data")));

app.use(compression({
    filter: function (req, res) {
        return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
    },
    level: 9
}));

require("./router.js")(app);

http.listen(app.get("port"), function () {
    console.log("HTTP \x1B[90mserver listening on port \x1B[0m" + app.get("port"));
});

module.exports = {
    http: http
};