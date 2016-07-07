"use strict";

let exec = require("child_process").exec;
let querystring = require("querystring");

const HTTP_OK_DESC = "Saul Goodman";

function startWithBlocking() {
    // "[I]nstead of trying to explain what "blocking" and "non-blocking"
    // means, let's demonstrate ourselves what happens if we add a blocking
    // operation to our request handlers."
    //
    // "To do this, we will modify our start request handler to make it wait
    // 10 seconds before returning its "Hello Start" string. Because there is
    // no such thing as sleep() in JavaScript, we will use a clever hack for
    // that."
    //
    // "[The] start() [function] contains a blocking operation. Like in "it's
    // blocking everything else from working". And that is a problem, because,
    // as the saying goes: "In node, everything runs in parallel, except your
    // code". What that means is that Node.js can handle a lot of concurrent
    // stuff, but doesn't do this by splitting everything into threads - in
    // fact, Node.js is single-threaded." (SO EVERYTHING WAITS 10 SECONDS)
    //
    // "Instead, it does so by running an event loop, and we the developers can
    // make use of this - we should avoid blocking operations whenever possible,
    // and use non-blocking operations instead. But to do so, we need to make
    // use of callbacks by passing functions around to other functions that
    // might do something that takes some time (like sleep for 10 seconds, or
    // query a database, or do some expensive calculation)."

    console.log("Request handler 'start' was called.");

    function sleep(ms) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + ms);
    }

    sleep(10000);
    return "Hello Start";
}

function startWithExec() {
    // "What exec() does is, it executes a shell command from within Node.js."
    //
    // "exec() does its magic in a non-blocking fashion. That's a good thing,
    // because this way we can execute very expensive shell operations (e.g.,
    // copying huge files around or similar stuff) without forcing our
    // application into a full stop as the blocking sleep operation did."
    //
    // "The problem is that exec(), in order to [be] non-blocking, makes use of
    // a callback function.
    //
    // And herein lies the root of our problem: our own
    // code is executed synchronous[ly], which means that immediately after
    // calling exec(), Node.js continues to execute return content. At this
    // point, content is still "empty", due to the fact that the callback
    // function passed to exec() has not yet been called - because exec()
    // operates asynchronous[ly]."

    console.log("Request handler 'start' was called.");

    let content = "empty";

    exec("dir", (error, stdout, stderr) => {
        content = stdout;
    });

    return content;
}

function writePlainTextResponse(response, stdout) {
    const headers = {
        "Content-Type": "text/plain"
    };

    response.writeHead(200, HTTP_OK_DESC, headers);
    response.write(stdout);
    response.end();
}

function startPlainText(response) {
    // "...[O]ur application...[used] to transport the content (which the
    // request handlers would like to display to the user) from the request
    // handlers to the HTTP server by returning it up THROUGH the layers of
    // the application (request handler -> router -> server)."
    //
    // "Our new approach is as follows: instead of bringing the CONTENT to the
    // server, we will bring the SERVER to the content. To be more precise, we
    // will inject the response object (from our server's callback function
    // onRequest()) through the router into the request handlers. The handlers
    // will then be able to use this object’s functions to respond to requests
    // themselves."

    console.log("Request handler 'start' was called.");

    exec("dir", (error, stdout, stderr) => {
        writePlainTextResponse(response, stdout);
    });
}

function writeHtmlResponse(response, body) {
    const headers = {
        "Content-Type": "text/html"
    };

    response.writeHead(200, HTTP_OK_DESC, headers);
    response.write(body);
    response.end();
}

function start(response, postData) {
    console.log("Request handler 'start' was called.");

    var body = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="Content-Type" content="text/html" />
            </head>
            <body>
                <form action="/upload" method="post">
                    <div>
                        <textarea name="text" rows="20" cols="60"></textarea>
                    </div>
                    <input type="submit" value="Submit text" />
                </form>
            </body>
        </html>`;

    writeHtmlResponse(response, body);
}

function upload(response, postData) {
    console.log("Request handler 'upload' was called.");

    let text = postData ? querystring.parse(postData).text : "";
    let message = `You've sent the text: '${text}'.`;
    writePlainTextResponse(response, message);
}

exports.start = start;
exports.upload = upload;

// More info:
// http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/
