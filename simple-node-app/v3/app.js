const http = require('http')
const os = require('os')

let requestCount = 0

console.log("Kubia server starting...")

var handler = function (request, response) {
    console.log("Received requiest from " + request.connection.remoteAddress)
    
    if (++requestCount >= 5) {
        response.writeHead(500)
        response.end("Some internal error has occured! This is pod " + os.hostname() + "\n")
    }
    else {
        response.writeHead(200)
        response.end("This is v3 running in pod " + os.hostname() + "\n")
    }   
 
};

var www = http.createServer(handler)
www.listen(8080)
