var PORT = 8888;

var http = require("http");
var requestListener = function(request, response) {
    console.log("Request received.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
};

http.createServer(requestListener).listen(PORT);
console.log("Server has started on port " + PORT + ".");

// More info:
// http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb
