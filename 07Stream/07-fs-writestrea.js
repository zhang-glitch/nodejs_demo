const fs = require('fs')

const ws = fs.createWriteStream('test.txt', {
  flags: 'w', 
  mode: 438,
  fd: null,
  encoding: "utf-8",
  // 从文件哪个位置开始写入
  start: 0,
  // 默认是16kb
  highWaterMark: 3
})

// 写入表示一次文件的打开和关闭。而不是调用write为一次。

// 字符串 或者  buffer -> fs rs
let buf = Buffer.from('abc')
ws.write(buf, () => {
  console.log('ok1')
}) 

// 多次写入
ws.write('中国', () => {
  console.log('ok2')
}) 

// createWriteStream 调用时触发
ws.on('open', (fd) => {
  console.log('open', fd)
}) 


// close 是在数据写入操作全部完成之后再执行。
// 只有手动调用end方法才会触发
ws.on('close', () => {
  console.log('文件关闭了')
}) 

// end 执行之后就意味着数据写入操作完成
ws.end('结束')


// error 并不能捕获语法错误。
ws.on('error', (err) => {
  console.log('出错了')
})

