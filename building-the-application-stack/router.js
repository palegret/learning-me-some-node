"use strict";

function route(pathname) {
    console.log(`About to route a request for ${pathname}...`);
}

exports.route = route;

// More info:
// http://martinfowler.com/articles/injection.html
