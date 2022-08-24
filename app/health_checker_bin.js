/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const a = require("http"),
    f = require("process"),
    g = Number(f.env.PORT) || 8080,
    h = Number(f.env.HEALTH_CHECKER_TIMEOUT_IN_MILLIS) || 5E3,
    k = Object.freeze(["127.0.0.1", "::1", "localhost"]);

function l(d, e = []) {
    const m = {
            host: d.splice(0, 1)[0],
            path: "/healthz",
            port: g,
            timeout: h
        },
        c = a.get(m, b => {
            200 === b.statusCode ? f.exit(0) : (console.warn(`Failed /healthz. Status code: ${b.statusCode}`), f.exit(1))
        });
    c.on("timeout", () => {
        c.abort();
        console.warn("TIMEOUT");
        f.exit(1)
    });
    c.on("error", b => {
        e.push(`ERROR: ${b}`);
        d.length ? l(d, e) : (e.forEach(n => {
            console.error(n)
        }), f.exit(1))
    });
    c.end()
}
l(k.slice(0));