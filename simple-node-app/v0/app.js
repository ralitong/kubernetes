const http = require('http')
const os = require('os')

let requestCount = 0

console.log("Kubia server starting...")

var handler = function (request, response) {
    console.log("Received requiest from " + request.connection.remoteAddress)

    if(requestCount >= 5) {
        response.writeHead(500)
        response.end("You've hit more than 5 requests, throwing an error...\n")
    }
    else {
        response.writeHead(200)
        response.end("You've hit " + os.hostname() + "\n")
    }

    requestCount += 1

};

var www = http.createServer(handler)
www.listen(8080)
