const net = require("net")


const server = net.createServer()

const PORT = 1234
const HOST = 'localhost'

server.listen(PORT, HOST)

server.on("listening", () => {
  console.log("listen...")
})

server.on("connection", (socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk.toString())
  })

  socket.end("end server!")
})

