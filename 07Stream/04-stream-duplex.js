let {Duplex} = require('stream')

class MyDuplex extends Duplex{
  constructor(source) {
    super()
    this.source = source
  }
  _read() {
    let data = this.source.shift() || null 
    this.push(data)
  }
  _write(chunk, en, next) {
    process.stdout.write(chunk + "\n")
    process.nextTick(next)
  }
}

let source = ['a', 'b', 'c']
let myDuplex = new MyDuplex(source)

// 读和写是相互独立的。
myDuplex.on('data', (chunk) => {
  console.log(chunk.toString())
}) 

myDuplex.write('我是zhang-glitch', () => {
  console.log("end")
})
