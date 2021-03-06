"use strict";

function route(handle, pathname, request, response) {
    console.log(`About to route a request for ${pathname}...`);

    if (typeof handle[pathname] === "function")
        return handle[pathname](response, request);

    console.log(`No request handler found for ${pathname}.`);

    const headers = {
        "Content-Type": "text/plain"
    };

    response.writeHead(404, headers);
    response.write("404 - Not Found");
    response.end();
}

exports.route = route;

// More info:
// http://martinfowler.com/articles/injection.html
