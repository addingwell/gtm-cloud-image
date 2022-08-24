/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const m = require("http"),
    q = require("https"),
    r = require("url");
var y = class extends Error {
    constructor(a) {
        super(a);
        this.name = "HttpTimeoutError";
        Error.captureStackTrace(this, y)
    }
};

function z(a, c, f) {
    const k = !!c.followRedirects,
        t = Number(c.maxRedirects),
        u = isNaN(t) ? 3 : t;
    if (k && 0 > u) return Promise.reject(Error("Too many redirects."));
    let g, v;
    return (new Promise((w, l) => {
        var h = Number(c.timeout);
        let e = c.timeoutCallbacks;
        0 < h && (e = e || [], v = setTimeout(() => {
            for (const b of e) b()
        }, h));
        e && e.push(() => {
            g.abort();
            l(new y("Request timed out."))
        });
        const d = Object.assign({}, c);
        c.headers && (d.headers = Object.assign({}, c.headers));
        delete d.timeout;
        A(d);
        f && (d.headers || (d.headers = {}), d.headers["content-length"] =
            Buffer.byteLength(f));
        h = Object.assign(r.parse(a), d);
        if (B(a)) var x = q;
        else if (a.toLowerCase().startsWith("http://")) x = m;
        else throw Error(`URL ${a} uses unsupported protocol; must be HTTP or HTTPS.`);
        g = x.request(h, b => {
            if (k && 300 <= b.statusCode && 400 > b.statusCode && b.headers.location) {
                b.resume();
                const n = b.headers.location;
                B(a) && !B(n) ? l(Error("Unable to follow HTTPS -> HTTP redirect.")) : w(z(b.headers.location, Object.assign(d, {
                    timeoutCallbacks: e,
                    followRedirects: k,
                    maxRedirects: u - 1
                }), f))
            } else {
                var p = [];
                b.on("data",
                    n => {
                        p.push(n)
                    });
                b.on("end", () => {
                    w({
                        statusCode: b.statusCode,
                        headers: b.headers,
                        body: 0 === p.length ? void 0 : Buffer.concat(p).toString()
                    })
                })
            }
        });
        g.on("error", l);
        g.end(f)
    })).finally(() => void clearTimeout(v))
}

function B(a) {
    return a.toLowerCase().startsWith("https://")
}

function A(a) {
    global.server_js_dev_only && (a.headers || (a.headers = {}), a.headers["X-Google-GFE-Frontline-Info"] = "ssl")
};
require("process");
require("process");
const C = require("vm");
global.require = require;
z("https://www.googletagmanager.com/static/serverjs/server_bootstrap.js", Object.assign({}, {
    method: "GET"
})).then(function(a) {
    if (400 <= a.statusCode) throw Error(`Received HTTP status code ${a.statusCode}.`);
    try {
        C.runInThisContext(a.body || "")
    } catch (c) {
        throw console.error("Unable to process server bootstrap JS at https://www.googletagmanager.com/static/serverjs/server_bootstrap.js\n", c), c;
    }
}).catch(a => {
    console.error("Fetching server bootstrap JS from https://www.googletagmanager.com/static/serverjs/server_bootstrap.js failed.");
    throw a;
});