const fs = require('fs')

let rs = fs.createReadStream('test.txt', {
  // 操作符
  flags: 'r',
  // buffer的形式读取
  encoding: null, 
  // 标识符
  fd: null,
  // 权限位
  mode: 438,
  // 自动关闭文件
  autoClose: true, 
  // 表示读取范围，头尾都包 （开始读取）
  start: 0,
  // 结束读取 
  // end: 3,
  // 每次读取几个字节数据。即buffer缓冲区长度 默认是64kb
  highWaterMark: 3
})

// data事件中的 rs._readableState.length 始终是0,所以我们读取时并不在缓冲区中读取
// rs.on('data', (chunk) => {
//   console.log(chunk.toString())
//   // 通过pause, resume可以实现暂停模式读取文件
//   // 暂停读取
//   // rs.pause()
//   // setTimeout(() => {
//   //   // 开始读取
//   //   rs.resume()
//   // }, 1000)
// }) 

// 会自动触发该事件，知道数据读取完成
// rs.on('readable', () => {
//   // let data = rs.read()
//   // console.log(data?.toString())
//   let data
//   while((data = rs.read(1)) !== null) {
//     console.log(data.toString())
//     // 读取缓存区的存在的数据。如果该数据长度为0，就会重新触发_read进行数据读取到缓存区。读取的长度就是highWaterMark定义的长度
//     console.log('----------', rs._readableState.length)
//   }
// }) 



// createReadStream调用后就会触发
// rs.on('open', (fd) => {
//   console.log(fd, '文件打开了')
// })

// 数据消费完毕出发
// rs.on('close', () => {
//   console.log('文件关闭了')
// })


// 数据读取是分段的，我们需要拿到读取的所有buffer，然后在处理
let bufferArr = []
rs.on('data', (chunk) => {
  bufferArr.push(chunk)
})

rs.on('end', () => {
  // 如果是buffer，我们需要通过concat拼接
  console.log(Buffer.concat(bufferArr).toString())
  // 注意from传入的参数是一个数组，而不是buffer数组。
  // console.log(bufferArr, Buffer.from(bufferArr).toString())
  console.log('当数据被清空之后')
})

rs.on('error', (err) => {
  console.log('出错了')
})