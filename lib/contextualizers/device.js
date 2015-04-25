"use strict";

var TABLET = "tablet",
    SMARTPHONE = "smartphone",
    DESKTOP = "desktop",
    IOS = "ios",
    ANDROID = "android",
    WINDOWS = "windows",
    regex = {
        galaxy: /gt-p1010/i,
        mobile: /mobile/i,
        android: /android/i,
        ipad: /ipad/i,
        iphone: /ipod|iphone/i,
        webOS: /webOS\//,
        mac: /(Intel|PPC) Mac OS X/,
        windows: /Windows NT ([0-9\._]+)[\);]/
    };

function _device (ua) {
    var mobile = regex.mobile.test(ua),
        android = regex.android.test(ua),
        // ipad = regex.ipad.test(ua),
        iphone = regex.iphone.test(ua),
        webOS = regex.webOS.test(ua),
        mac = regex.mac.test(ua),
        windows = regex.windows.test(ua);

    if (mobile && android) {
        return {type: SMARTPHONE, os: ANDROID};
    }
    if (iphone) {
        return {type: SMARTPHONE, os: IOS};
    }
    if (webOS) {
        return {type: SMARTPHONE, os: IOS};
    }
    if (mac) {
        return {type: DESKTOP, os: IOS};
    }
    if (windows) {
        return {type: DESKTOP, os: WINDOWS};
    }

    return {};
}

module.exports = function(req, res, next) {
    var device = req.param("device");

    if (device && {TABLET: 1, SMARTPHONE: 1, DESKTOP: 1}[device]) {
        req.context.device = device;
        if (device !== DESKTOP) {
            var os = req.param("os");
            req.context.os = (os && {IOS: 1, ANDROID: 1, WINDOWS: 1}[os] && os) || IOS;
        }
    } else {
        device = _device(req.headers["user-agent"]);
        req.context.device = device.type || DESKTOP;
        if (req.context.device !== DESKTOP) {
            req.context.os = device.os || WINDOWS;
        }
    }
    req.context.ip = req.ip;
    req.context.ref = req.headers.referer;

    next();
};