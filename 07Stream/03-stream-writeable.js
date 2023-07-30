const { Writable } = require('stream')

class MyWriteable extends Writable {
  constructor() {
    super()
  }
  _write(chunk, en, done) {
    // 将数据输出到控制台
    process.stdout.write(chunk.toString() + '\n')
    // 执行传入的回调
    process.nextTick(done)
  }
}

let myWriteable = new MyWriteable()

myWriteable.write('我是zhang-glitch', 'utf-8', () => {
  console.log('end')
})