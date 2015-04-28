/*global window:false*/
/*global dust:false*/

"use strict";

var singlePageApp = window.singlePageApp || {};

(function (singlePageApp) {

	function DustWrapper (config) {
		this.dust.context = dust.makeBase(config);
	}

    DustWrapper.render = function (name, context, callback) {
        return dust.render(name, (this.context && this.context.push(context)) || context, callback);
    };

	singlePageApp.dust = DustWrapper;

}(singlePageApp));