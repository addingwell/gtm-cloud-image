/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const l = require("http"),
    m = require("https"),
    v = require("url");
var w = class extends Error {
    constructor(a) {
        super(a);
        this.name = "HttpTimeoutError";
        Error.captureStackTrace(this, w)
    }
};

function x(a, b, e) {
    const h = !!b.followRedirects,
        n = Number(b.maxRedirects),
        p = isNaN(n) ? 3 : n;
    if (h && 0 > p) return Promise.reject(Error("Too many redirects."));
    let f, q;
    return (new Promise((r, t) => {
        var g = Number(b.timeout);
        0 < g && (q = setTimeout(() => {
            f.abort();
            t(new w("Request timed out."))
        }, g));
        const d = Object.assign({}, b);
        b.headers && (d.headers = Object.assign({}, b.headers));
        delete d.timeout;
        y(d);
        e && (d.headers || (d.headers = {}), d.headers["content-length"] = Buffer.byteLength(e));
        g = Object.assign(v.parse(a), d);
        if (a.toLowerCase().startsWith("https://")) var u =
            m;
        else if (a.toLowerCase().startsWith("http://")) u = l;
        else throw Error(`URL ${a} uses unsupported protocol; must be HTTP or HTTPS.`);
        f = u.request(g, c => {
            if (h && 300 <= c.statusCode && 400 > c.statusCode && c.headers.location) c.resume(), r(x(c.headers.location, Object.assign(d, {
                followRedirects: h,
                maxRedirects: p - 1
            }), e));
            else {
                var k = [];
                c.on("data", z => {
                    k.push(z)
                });
                c.on("end", () => {
                    r({
                        statusCode: c.statusCode,
                        headers: c.headers,
                        body: 0 === k.length ? void 0 : Buffer.concat(k).toString()
                    })
                })
            }
        });
        f.on("error", t);
        f.end(e)
    })).finally(() =>
        clearTimeout(q))
}

function y(a) {
    global.server_js_dev_only && (a.headers || (a.headers = {}), a.headers["X-Google-GFE-Frontline-Info"] = "ssl")
};
require("process");
require("process");
const A = require("vm");
global.require = require;
x("https://www.googletagmanager.com/static/serverjs/server_bootstrap.js", Object.assign({}, {
    method: "GET"
})).then(function(a) {
    if (!(400 > a.statusCode)) {
        var b = `Received HTTP status code ${a.statusCode}.`;
        void 0 != a.body && (b += `\n\n${a.body}`);
        throw Error(b);
    }
    try {
        A.runInThisContext(a.body || "")
    } catch (e) {
        throw console.error("Unable to process server bootstrap JS at https://www.googletagmanager.com/static/serverjs/server_bootstrap.js\n", e), e;
    }
}).catch(a => {
    console.error("Fetching server bootstrap JS from https://www.googletagmanager.com/static/serverjs/server_bootstrap.js failed.");
    throw a;
});