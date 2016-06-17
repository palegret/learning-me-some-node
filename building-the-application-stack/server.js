// Need strict mode for ES6:
// "SyntaxError: Block-scoped declarations (let, const, function, class) not
// yet supported outside strict mode"
"use strict";

const PORT = 8888;

let http = require("http");
let requestListener = (request, response) => {
    console.log("Request received.");

    const headers = {
        "Content-Type": "text/plain"
    };

    response.writeHead(200, "Saul Goodman", headers);
    response.write("Hello World");
    response.end();
};

http.createServer(requestListener).listen(PORT);
console.log(`Server has started on port ${PORT}.`);

// More info:
// http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb
