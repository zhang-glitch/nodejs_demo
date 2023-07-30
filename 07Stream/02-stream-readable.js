const {Readable} = require('stream')

// 模拟底层数据
let source = ['zh', 'llm', 'hh']

// 自定义类继承 Readable
class MyReadable extends Readable{
  constructor(source) {
    super()
    this.source = source
  }
  // 提供数据消费
  _read() {
    // 将数据放在缓存区
    let data = this.source.shift() || null 
    this.push(data)
  }
}

// 实例化
let myReadable = new MyReadable(source)

/**
 * 
 * 两种读取方式
 * - readable：将数据读取到缓存区，然后在进行消费（暂停模式）
 * - data：数据远远不断地输出，可以直接消费 （流动模式）
 */
myReadable.on('readable', () => {
  let data = null 
  // read方法可以设置指定的读取长度
  while((data = myReadable.read(2)) != null) {
    console.log(data.toString())
  }
}) 

// myReadable.on('data', (chunk) => {
//   console.log(chunk.toString())
// })