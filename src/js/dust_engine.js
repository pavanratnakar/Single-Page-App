/*global window:false*/
/*global dust:false*/

"use strict";

var singlePageApp = window.singlePageApp || {};

singlePageApp.dust = {};
singlePageApp.dust.load = function () {
    this.context = dust.makeBase({
        i18n: window.data.i18n,
        config: window.data.config,
        context: window.data.context
    });
};
singlePageApp.dust.render = function (name, context, callback) {
    return dust.render(name, (this.context && this.context.push(context)) || context, callback);
};
singlePageApp.dust.load();