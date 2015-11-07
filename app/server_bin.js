/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const h = require("http"),
    k = require("https");
require("url");

function l(b, c, e, g) {
    return a => {
        const d = a.statusCode;
        if (300 <= d && 400 > d && a.headers.location) a.resume(), 3 === g ? c && c(Error("Too many redirects.")) : e(a.headers.location, g + 1);
        else if (2 > b.length) a.resume(), 200 > d || 299 < d ? c && c(Error(`Received HTTP status code ${d}.`)) : b(a);
        else {
            var f = [];
            a.on("data", m => void f.push(m));
            a.on("end", () => {
                200 > d || 299 < d ? c && c(Error(`Received HTTP status code ${d}.\n\n
                ${f.join("")}`)) : b(a, f.join(""))
            })
        }
    }
}

function n(b) {
    global.server_js_dev_only && (b.headers || (b.headers = {}), b.headers["X-Google-GFE-Frontline-Info"] = "ssl")
};
require("process");
const p = require("vm");
global.require = require;
(function(b, c) {
    function e(a, d) {
        if (a.toLowerCase().startsWith("https://")) var f = k;
        else if (a.toLowerCase().startsWith("http://")) f = h;
        else throw Error(`URL ${a} uses unsupported protocol; must be HTTP or HTTPS.`);
        a = f.get(a, g, l(b, c, e, d));
        if (c) a.on("error", c)
    }
    const g = {};
    n(g);
    e("https://www.googletagmanager.com/static/serverjs/server_bootstrap.js", 0)
})(function(b, c) {
    try {
        p.runInThisContext(c)
    } catch (e) {
        throw console.error("Unable to process server bootstrap JS at https://www.googletagmanager.com/static/serverjs/server_bootstrap.js\n", e),
            e;
    }
}, b => {
    console.error("Fetching server bootstrap JS from https://www.googletagmanager.com/static/serverjs/server_bootstrap.js failed.");
    throw b;
});