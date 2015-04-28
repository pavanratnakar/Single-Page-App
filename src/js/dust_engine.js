/*global window:false*/
/*global dust:false*/

"use strict";

var singlePageApp = window.singlePageApp || {};

singlePageApp.dust = function (config) {

    function DustWrapper (config) {
        this.context = dust.makeBase(config);
    }

    DustWrapper.prototype.render = function (name, context, callback) {
        return dust.render(name, (this.context && this.context.push(context)) || context, callback);
    };

    singlePageApp.dust = new DustWrapper(config);

};