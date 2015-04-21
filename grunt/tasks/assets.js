"use strict";

var path = require("path"),
    fs = require("fs-extra"),
    async = require("async"),
    dust = require("dustjs-helpers");

module.exports = function(grunt) {
    grunt.registerTask("assets", "Prepare assets for local consumption", function() {
        var done = this.async(),
            filepath = {};

        async.auto({
            CompileTemplates: function(callback) {
                var compiled = "",
                    templates = path.resolve("templates");

                async.series({
                    PrepareDust: function(next) {
                        grunt.log.writeln("Preparing Dust");
                        var helpers = path.resolve("lib/dust-helpers");
                        async.each(fs.readdirSync(helpers), function(file, next) {
                            var _ext = path.extname(file);
                            if (_ext.toLowerCase() === ".js") {
                                require(path.join(helpers, file))(dust);
                            }
                            next();
                        }, next);
                    },
                    Compile: function(next) {
                        grunt.log.writeln("Compiling Templates");
                        (function _compile (dir, next) {
                            async.each(fs.readdirSync(dir), function(file, next) {
                                var workPath = path.join(dir, file),
                                    stats = fs.statSync(workPath);

                                if (stats.isDirectory()) {
                                    return _compile(workPath, next);
                                }

                                var _ext = path.extname(file),
                                    _name = _ext.toLowerCase() === ".dust" && path.basename(file, _ext),
                                    _pre = path.relative(templates, dir);

                                if (!_name) {
                                    return next();
                                }

                                if (_pre) {
                                    _name = _pre + "/" + _name;
                                }

                                fs.readFile(workPath, "utf8", function (err, content) {
                                    if (!err) {
                                        var tmp = "dust.cache['" + _name + "'] = " + dust.compile(content, _name, true) + "\r";
                                        compiled += tmp;
                                    }
                                    next();
                                });
                            }, next);
                        }(templates, next));
                    },
                    SaveFiles: function(next) {
                        var head = "dust.cache = dust.cache || {};\r\n";

                        filepath = path.join("dist", "templates", "templates.js");
                        fs.outputFile(filepath, head + compiled, next);
                    }
                }, function(err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, filepath);
                });
            }
        }, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("Grunt Done.");
            done();
        });
    });
};