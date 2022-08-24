/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const v = require("http"),
    y = require("https"),
    z = require("url");
var A = class extends Error {
    constructor(a) {
        super(a);
        this.name = "HttpTimeoutError";
        Error.captureStackTrace(this, A)
    }
};

function B(a, b, c) {
    const e = !!b.followRedirects,
        l = Number(b.maxRedirects),
        h = isNaN(l) ? 3 : l;
    if (e && 0 > h) return Promise.reject(Error("Too many redirects."));
    let r, m;
    return (new Promise((u, f) => {
        var n = Number(b.timeout);
        0 < n && (m = setTimeout(() => {
            r.abort();
            f(new A("Request timed out."))
        }, n));
        const k = Object.assign({}, b);
        b.headers && (k.headers = Object.assign({}, b.headers));
        delete k.timeout;
        C(k);
        c && (k.headers || (k.headers = {}), k.headers["content-length"] = Buffer.byteLength(c));
        n = Object.assign(z.parse(a), k);
        if (D(a)) var g =
            y;
        else if (a.toLowerCase().startsWith("http://")) g = v;
        else throw Error(`URL ${a} uses unsupported protocol; must be HTTP or HTTPS.`);
        r = g.request(n, d => {
            if (e && 300 <= d.statusCode && 400 > d.statusCode && d.headers.location) {
                d.resume();
                const p = d.headers.location;
                D(a) && !D(p) ? f(Error("Unable to follow HTTPS -> HTTP redirect.")) : u(B(d.headers.location, Object.assign(k, {
                    followRedirects: e,
                    maxRedirects: h - 1
                }), c))
            } else {
                var q = [];
                d.on("data", p => {
                    q.push(p)
                });
                d.on("end", () => {
                    u({
                        statusCode: d.statusCode,
                        headers: d.headers,
                        body: 0 ===
                            q.length ? void 0 : Buffer.concat(q).toString()
                    })
                })
            }
        });
        r.on("error", f);
        r.end(c)
    })).finally(() => clearTimeout(m))
}

function D(a) {
    return a.toLowerCase().startsWith("https://")
}

function C(a) {
    global.server_js_dev_only && (a.headers || (a.headers = {}), a.headers["X-Google-GFE-Frontline-Info"] = "ssl")
};
const E = require("process"),
    F = {
        "gtm-ctfe-integration.corp.google.com/gtm/static/server_bootstrap_dev_only.js": "/abns/container-tag-serving-qa/analytics_integration.ctfe_proxy.server",
        "gtm-ctfe-preprod.corp.google.com/gtm/static/server_bootstrap_dev_only.js": "/abns/container-tag-serving-preprod/analytics_preprod.ctfe_proxy.server",
        "gtm-ctfe-integration.corp.google.com/server.js": "/abns/container-tag-serving-qa/analytics_integration.ctfe_proxy.server",
        "gtm-ctfe-preprod.corp.google.com/server.js": "/abns/container-tag-serving-preprod/analytics_preprod.ctfe_proxy.server",
        "www.googleadservices.com/pagead/": "/abns/ads-bow/shared.eventfe"
    };

function G(a, b) {
    var c = {};
    if (c.method && "GET" !== c.method) return Promise.reject(Error(`HttpOverRpc must be a GET. Got ${c.method} method for ${b}`));
    const e = new URL(b);
    let l = Object.keys(F).filter(h => (e.hostname + e.pathname).startsWith(h)).map(h => F[h])[0];
    l = l || e.host;
    try {
        const h = a(),
            r = E.env.RUNFILES + "/google3/analytics/container_tag/templates/server_js/image/http_over_rpc_proto.protodb";
        let m = `GET ${e.pathname+e.search} HTTP/1.1\r\n`;
        m += `Host: ${e.hostname}\r\n`;
        m += "X-Google-GFE-Frontline-Info: ssl\r\n";
        c.headers && c.headers.cookie && (m += `Cookie: ${c.headers.cookie}\r\n`);
        m += "\r\n";
        const u = {
            text: Buffer.from(m).toString("base64")
        };
        return h.Rpcs.fromProtoDB(r, l, "HTTPOverRPC").HTTPRequest(u, {
            deadline: 10
        }).then(f => {
            a: {
                var n = l;
                var k = m;f = Buffer.from(f.text, "base64").toString("utf8").split("\r\n");
                const d = {
                    statusCode: 0,
                    headers: {},
                    body: void 0
                };
                var g = 0;
                const q = {};
                for (let p = 0; p < f.length; p++) {
                    const t = f[p];
                    if (0 === p) {
                        g = t.split(" ");
                        if (3 !== g.length) break;
                        g = parseInt(g[1], 10);
                        g = isNaN(g) ? 500 : g;
                        continue
                    }
                    if (!t) {
                        d.statusCode =
                            g;
                        d.headers = q;
                        d.body = f.slice(p + 1).join("\r\n");
                        n = d;
                        break a
                    }
                    const w = t.indexOf(": ");
                    if (-1 === w) continue;
                    const x = t.substring(0, w);
                    q[x] = q[x] || [];
                    q[x].push(t.substring(w + 2))
                }
                n = Promise.reject(Error(`Received an invalid HttpOverRpc response from ${n}.\n\nRequest: ${k}\n\nResponse: ${f.join("\r\n")}`))
            }
            return n
        }, f => Promise.reject(Error(`An error occurred while sending an HttpOverRpc request to ${l}.\n\n${f}`)))
    } catch (h) {
        return Promise.reject(Error(`An error occurred while sending an HttpOverRpc request to ${l}.\n\n${h}`))
    }
};
const H = require("process"),
    I = require("vm");
(function() {
    let a = "https://www.googletagmanager.com/static/serverjs/server_bootstrap.js";
    global.require = require;
    global.server_js_dev_only = !0;
    a = H.env.SERVER_BOOTSTRAP_JS_URL || a;
    if (!/^https?:\/\/.+/i.test(a)) throw Error("Invalid URL (must begin with http:// or https://): " + a);
    G(() => require("stubby_client"), a).catch(b => B(a, Object.assign({}, {
        method: "GET"
    })).catch(c => {
        console.error(b);
        console.error(c);
        throw c;
    })).then(function(b) {
        if (!(400 > b.statusCode)) {
            var c = `Received HTTP status code ${b.statusCode}.`;
            void 0 != b.body && (c += `\n\n${b.body}`);
            throw Error(c);
        }
        try {
            I.runInThisContext(b.body || "")
        } catch (e) {
            throw console.error(`Unable to process server bootstrap JS at ${a}\n`, e), e;
        }
    }).catch(b => {
        console.error(`Fetching server bootstrap JS from ${a} failed.`);
        throw b;
    })
})();