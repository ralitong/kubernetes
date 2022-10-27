const http = require('http')
const os = require('os')
const fs = require('fs')
const dns = require('dns')

const dataFile = "/var/data/kubia.txt"
const serviceName = "kubia.default.svc.cluster.local"
const port = 8080;


console.log("Kubia server starting...")

var handler = function (request, response) {
    if (request.method === 'POST') {
        var file = fs.createWriteStream(dataFile)
        file.on('open', function(fd){
            request.pipe(file)
            console.log("New data has been received and stored.")
            response.writeHead(200)
            response.end("Data stored on pod " + os.hostname() + "\n")
        });
    } else {

        response.writeHead(200)
        if(request.url == '/data') {
            fs.access(dataFile, fs.F_OK, (err) => {
                var data = ""
                if(err)
                    data = "No data posted yet"
                else
                    data = fs.readFileSync(dataFile, 'utf8')
                response.end("Data stored on this pod: " + data + "\n")
            });
        }
        else {
            response.write("You've hit " + os.hostname() + "\n")
            response.write("Data stored in the cluster:\n")
            dns.resolveSrv(serviceName, (err, addresses) => {
                

                if(err) {
                    response.end("Could not look up DNS SRV records: " + err)
                }
                else {
                    let numResponses = 0
                    if (addresses.length == 0) {
                        response.end("No peers discovred.")
                    } else {
                        addresses.forEach((item) => {
                            let requestOptions = {
                                host: item.name,
                                port: port,
                                path: '/data'
                            }
                            http.get(requestOptions, (returnedData) => {
                                returnedData.setEncoding('utf8')
                                returnedData.on('data', (chunk) => {
                                    numResponses++
                                    response.write("- " + item.name + ": " + chunk.trim())
                                    response.write("\n")
                                    if(numResponses == addresses.length)
                                        response.end()
                                })
                            })
                        })
                    }
                }
            })
        }
    }
};

var www = http.createServer(handler)
www.listen(8080)
