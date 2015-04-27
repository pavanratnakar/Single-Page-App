"use strict";

var fs = require("fs"),
    path = require("path"),
    util = require("util"),
    _ = require("lodash");

var configs = {
        master: {},
        others: []
    },
    // Order of priority
    selectors = ["lang", "intl", "device"],
    base = path.join(__dirname, "../configs");

fs.readdirSync(base).forEach(function(file) {
    var config = require(path.join(base, file));
    if (!util.isArray(config)) {
        config = [config];
    }
    config.forEach(function(cfg) {
        if (!cfg.selector || Object.keys(cfg.selector).length === 0) {
            delete cfg.selector;
            _.merge(configs.master, cfg, function(a, b) {
                return _.isArray(a) ? b : undefined;
            });
        } else if (selectors.some(function (selector) {return cfg.selector[selector] ? true : false;})) {
            configs.others.push(cfg);
        }
    });
});

_.sortBy(configs.others, function(cfg) {
    var hash = 0;
    selectors.forEach(function(name) {
        hash = hash << 1;
        if (cfg[name]) {
            hash++;
        }
    });
    return hash;
});

module.exports = {
    master: function(req, res, next) {
        var config;
        req.config = function() {
            if (config === undefined) {
                config = _.cloneDeep(configs.master);
            }
            return config;
        };
        next();
    },
    final: function(req, res, next) {
        var config;
        req.config = function() {
            if (config === undefined) {
                var temp = _.cloneDeep(configs.master),
                    others = _.cloneDeep(configs.others);

                others.forEach(function (cfg) {
                    if (Object.keys(cfg.selector).every(function(key) {
                        // If selector is invalid, skip it
                        if (selectors.indexOf(key) === -1) {
                            return true;
                        }

                        // If selector is an array
                        if (util.isArray(cfg.selector[key])) {
                            return ~cfg.selector[key].indexOf(req.context[key]);
                        }
                        // If it is a string
                        return cfg.selector[key] === req.context[key];

                    })) {
                        _.assign(temp, cfg, function(a, b) {
                            return _.isUndefined(a) || _.isArray(a) ? b : _.assign(a, b);
                        });
                    }
                });
                config = _.cloneDeep(temp);
                delete config.selector;
            }
            return config;
        };
        next();
    },
    cache: configs.master
};