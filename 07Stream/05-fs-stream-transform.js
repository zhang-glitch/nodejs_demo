const {Transform} = require("stream")

class MyTransform extends Transform {
  constructor(options) {
    super()
  }

  _transform(chunk, encoding, callback) {
    // 处理数据，交给可读流读取
    this.push(chunk.toString()+"111")
    callback(null)
  }
}

const myTransform = new MyTransform()

// 作为可写流写入数据
myTransform.write("张")
myTransform.write("三")

// 作为可读流读取数据
myTransform.on("readable", () => {
  console.log(myTransform.read().toString())
})