// 基于流的tcp通信

const net = require('net')

// 连接服务端
const client = net.createConnection({
  port: 1234, 
  host: '127.0.0.1'
})

// sleep
async function sleep() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000);
  })
}

client.on('connect', async () => {
  client.write('昊淼您好')
  // 出现连包
  // client.write('昊淼您好2')
  // client.write('昊淼您好3')
  // client.write('昊淼您好4')
  /**
   * 解决方案
   * 1. 延时发送
   */
  await sleep()
  client.write('昊淼您好2')
  await sleep()
  client.write('昊淼您好3')
  await sleep()
  client.write('昊淼您好4')
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