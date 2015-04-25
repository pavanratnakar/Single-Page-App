/*globals dust*/

/**
* i18nHelper provides utility dust helpers for i18n
* This helper is based upon dust-helpers.i18n
*
* {@translate key="{some.key}" $0="replacement" user="value"/}
* @class i18n
*/
(function () {
    "use strict";

    var UNDEFINED;

    function substitute (str, obj, context) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "g"), obj[key]);
            }
        }
        return str.replace(/\{\s*([a-z0-9\.]+)\s*\}/ig, function(match, key) {
            var val = context.get(key);
            return (val === UNDEFINED) ? match : val;
        });
    }

    function dustParams (params, chunk, context) {
        var k, v, output,
            aggregate = function (data) {
                output += data;
                return "";
            };

        for (v in params) {
            if (params.hasOwnProperty(v)) {
                k = v.replace(/\$([0-9]+)/, "$1");
                // if a passed param is actually a dust variable, compute its value
                if (typeof params[v] === "function") {
                    output = "";
                    chunk.tap(aggregate).render(params[v], context).untap();
                    params[k] = output;
                } else {
                    params[k] = params[v];
                }
            }
        }
        return params;
    }

    function i18nParams (params, chunk, context) {
        var translate = {template: "", params: {}},
            dict = context.get("i18n");

        try {
            translate.params = dustParams(params, chunk, context);
            if (!dict[translate.params.key]) {
                return {
                    template : "<!-- err i18n:" + translate.params.key + " not found -->",
                    params : {}
                };
            }
            translate.template = dict[translate.params.key];
        } catch (e) {}
        return translate;
    }

    function apply (dustInstance) {
        dustInstance.helpers.translate = function (chunk, context, bodies, params) {
            var i18n = i18nParams(params, chunk, context);

            if (bodies.block) {
                return chunk.render(bodies.block, context.push(params).push({translation: substitute(i18n.template, i18n.params, context)}));
            }
            chunk.write(substitute(i18n.template, i18n.params, context));
            return chunk;
        };
    }

    if (typeof exports !== "undefined") {
        module.exports = function (dustInstance) {
            apply(dustInstance);
        };
    } else {
        // Browser expects dust global
        apply(dust);
    }
}());