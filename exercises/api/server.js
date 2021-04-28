const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const { rejects } = require('assert')
const { resolve } = require('path')

/**
 * this function is blocking, fix that
 * @param {String} name full file name of asset in asset folder
 */
const findAsset = (name) => {
  const assetPath = path.join(__dirname, 'assets', name)
  return new Promise((resolve, rejects) => {
    fs.readFile(assetPath, {encoding: 'utf-8'}, (error, results) =>{
      if  (error){
        reject(error)
      }
      else {
        resolve(results)
      }
    })
  })
}

const hostname = '127.0.0.1'
const port = 3000

// log incoming request coming into the server. Helpful for debugging and tracking
const logRequest = (method, route, status) => console.log(method, route, status)

const server = http.createServer( async (req, res) => {
  const method = req.method
  const route = url.parse(req.url).pathname
  // this is sloppy, especially with more assets, create a "router"
  if (route === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(await findAsset('index.html'))
    logRequest(method, route, 200)
    res.end()
  } else {
    // missing asset should not cause server crash
    //throw new Error('route not found')
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end()
  }
  // most important part, send down the asset
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
