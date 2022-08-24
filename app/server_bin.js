/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const l = require("http"),
    p = require("https"),
    q = require("url");
var x = class extends Error {
    constructor(a) {
        super(a);
        this.name = "HttpTimeoutError";
        Error.captureStackTrace(this, x)
    }
};

function y(a, c, e) {
    const h = !!c.followRedirects,
        r = Number(c.maxRedirects),
        t = isNaN(r) ? 3 : r;
    if (h && 0 > t) return Promise.reject(Error("Too many redirects."));
    let f, u;
    return (new Promise((v, k) => {
        var g = Number(c.timeout);
        0 < g && (u = setTimeout(() => {
            f.abort();
            k(new x("Request timed out."))
        }, g));
        const d = Object.assign({}, c);
        c.headers && (d.headers = Object.assign({}, c.headers));
        delete d.timeout;
        z(d);
        e && (d.headers || (d.headers = {}), d.headers["content-length"] = Buffer.byteLength(e));
        g = Object.assign(q.parse(a), d);
        if (A(a)) var w =
            p;
        else if (a.toLowerCase().startsWith("http://")) w = l;
        else throw Error(`URL ${a} uses unsupported protocol; must be HTTP or HTTPS.`);
        f = w.request(g, b => {
            if (h && 300 <= b.statusCode && 400 > b.statusCode && b.headers.location) {
                b.resume();
                const m = b.headers.location;
                A(a) && !A(m) ? k(Error("Unable to follow HTTPS -> HTTP redirect.")) : v(y(b.headers.location, Object.assign(d, {
                    followRedirects: h,
                    maxRedirects: t - 1
                }), e))
            } else {
                var n = [];
                b.on("data", m => {
                    n.push(m)
                });
                b.on("end", () => {
                    v({
                        statusCode: b.statusCode,
                        headers: b.headers,
                        body: 0 ===
                            n.length ? void 0 : Buffer.concat(n).toString()
                    })
                })
            }
        });
        f.on("error", k);
        f.end(e)
    })).finally(() => clearTimeout(u))
}

function A(a) {
    return a.toLowerCase().startsWith("https://")
}

function z(a) {
    global.server_js_dev_only && (a.headers || (a.headers = {}), a.headers["X-Google-GFE-Frontline-Info"] = "ssl")
};
require("process");
require("process");
const B = require("vm");
global.require = require;
y("https://www.googletagmanager.com/static/serverjs/server_bootstrap.js", Object.assign({}, {
    method: "GET"
})).then(function(a) {
    if (!(400 > a.statusCode)) {
        var c = `Received HTTP status code ${a.statusCode}.`;
        void 0 != a.body && (c += `\n\n${a.body}`);
        throw Error(c);
    }
    try {
        B.runInThisContext(a.body || "")
    } catch (e) {
        throw console.error("Unable to process server bootstrap JS at https://www.googletagmanager.com/static/serverjs/server_bootstrap.js\n", e), e;
    }
}).catch(a => {
    console.error("Fetching server bootstrap JS from https://www.googletagmanager.com/static/serverjs/server_bootstrap.js failed.");
    throw a;
});