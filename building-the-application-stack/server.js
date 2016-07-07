// Need strict mode for ES6: "SyntaxError: Block-scoped declarations (let,
// const, function, class) not yet supported outside strict mode"

"use strict";

const PORT = 8888;

let http = require("http");
let url = require("url");

function startListening(listener) {
    http.createServer(listener).listen(PORT);
    console.log(`Server has started on port ${PORT}.`);
}

function startOriginal(route, handle) {
    let requestListener = (request, response) => {
        let parsedUrl = url.parse(request.url);
        let pathname = parsedUrl ? parsedUrl.pathname : "";
        let isFavicon = (/favicon\.ico\b/i).test(pathname);

        if (isFavicon)
            return;

        let content = "";

        console.log(`Request for ${pathname} received.`);
        route(pathname, response, handle);
    };

    startListening(requestListener);
}

function start(route, handle) {
    let requestListener = (request, response) => {
        let postData = "";
        let parsedUrl = url.parse(request.url);
        let pathname = parsedUrl ? parsedUrl.pathname : "";

        console.log(`Request for ${pathname} received.`);

        request.setEncoding("utf8");

        request.addListener("data", (postDataChunk) => {
            postData += postDataChunk;
            console.log(`Received POST data chunk '${postDataChunk}'.`);
        });

        request.addListener("end", () => {
            route(pathname, response, handle, postData);
        });
    };

    startListening(requestListener);
}

exports.start = start;

// More info:
// http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb
