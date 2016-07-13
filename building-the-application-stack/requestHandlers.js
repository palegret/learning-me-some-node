"use strict";

let querystring = require("querystring");
let fs = require("fs");
let formidable = require("formidable");

const HTTP_OK_DESC = "Saul Goodman";

function writePlainTextResponse(response, stdout) {
    const headers = {
        "Content-Type": "text/plain"
    };

    response.writeHead(200, HTTP_OK_DESC, headers);
    response.write(stdout);
    response.end();
}

function writeHtmlResponse(response, body) {
    const headers = {
        "Content-Type": "text/html"
    };

    response.writeHead(200, HTTP_OK_DESC, headers);
    response.write(body);
    response.end();
}

function start(response, request) {
    console.log("Request handler 'start' was called.");

    var body = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="Content-Type" content="text/html" />
            </head>
            <body>
                <form action="/upload" enctype="multipart/form-data" method="post">
                    <div>
                        <input type="file" id="upload" name="upload" multiple="multiple">
                    </div>
                    <input type="submit" value="Upload File" />
                </form>
            </body>
        </html>`;

    writeHtmlResponse(response, body);
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    let incomingForm = new formidable.IncomingForm();

    console.log("About to parse form data...");

    incomingForm.parse(request, function(err, fields, files) {
        console.log("...parsing done.");

        fs.renameSync(files.upload.path, "./uploaded.png");

        response.writeHead(200, { "Content-Type": "text/html" });
        response.write("Received image:<br>");
        response.write(`<img src="/show" />`);
        response.end();
    });
}

function show(response, request) {
    console.log("Request handler 'show' was called.");

    fs.readFile("./uploaded.png", "binary", (error, file) => {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(error + "\n");
        } else {
            response.writeHead(200, { "Content-Type": "image/png" });
            response.write(file, "binary");
        }

        response.end();
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;

// More info:
// http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/
