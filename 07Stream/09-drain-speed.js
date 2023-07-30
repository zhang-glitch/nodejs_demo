/**
 * 需求：“中国牛逼” 写入指定的文件
 * 01 一次性写入
 * 02 分批写入
 */
let fs = require('fs')

let ws = fs.createWriteStream('test.txt', {
  highWaterMark: 3
})

// 对于大量数据，他会造成内存溢出。
// 如果生产者生产的数据大于消费者消费的数据，那么多余的数据将放在缓冲区中
// ws.write('中国牛逼')

let source = "中国牛逼".split('')
let num = 0
let flag = true

function executeWrite () {
  flag = true
  while(num !== 4 && flag) {
    flag = ws.write(source[num])
    num++
  }
}

executeWrite()

ws.on('drain', () => {
  console.log('drain 执行了')
  // 控制继续写入
  executeWrite()
})

