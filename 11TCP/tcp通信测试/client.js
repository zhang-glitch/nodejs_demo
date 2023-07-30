// 基于流的tcp通信

const net = require('net')

// 连接服务端
const client = net.createConnection({
  port: 1234, 
  host: '127.0.0.1'
})

client.on('connect', () => {
  client.write('昊淼您好')
})

client.on('data', (chunk) => {
  console.log(chunk.toString())
})

client.on('error', (err) => {
  console.log(err)
})

client.on('close', () => {
  console.log('客户端断开连接')
})