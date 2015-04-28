/*global window:false*/
/*global dust:false*/

"use strict";

var singlePageApp = window.singlePageApp || {};

singlePageApp.dust = {
    load: function (config) {
        this.context = dust.makeBase(config);
    },
    render: function (name, context, callback) {
        return dust.render(name, (this.context && this.context.push(context)) || context, callback);
    }
};
singlePageApp.dust.load();