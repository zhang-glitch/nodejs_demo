let fs = require('fs')

let rs = fs.createReadStream('test.txt', {
  highWaterMark: 4
})

let ws = fs.createWriteStream('test1.txt', {
  highWaterMark: 1
})

let flag = true

rs.on('data', (chunk) => {
  flag = ws.write(chunk, () => {
    console.log('写完了')
  })
  if (!flag) {
    rs.pause()
  }
})

// 当drain触发时，表示数据可以继续写入
ws.on('drain', () => {
  rs.resume()
}) 

// pipe做的事情就是上面那些代码做的事情
// rs.pipe(ws)