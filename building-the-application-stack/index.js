"use strict";

let server = require("./server");
let router = require("./router");
let requestHandlers = require("./requestHandlers");

let handle = {
    "/": requestHandlers.start;
    "/start": requestHandlers.start;
    "/upload": requestHandlers.upload;
};

server.start(router.route, handle);

// More info:
// http://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html
