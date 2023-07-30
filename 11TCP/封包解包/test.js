const MyTransform = require('./myTransform.js')

let ts = new MyTransform()

let str1 = '昊淼'

console.log(Buffer.from(str1)) // <Buffer e6 98 8a e6 b7 bc>
// 编号 00 长度 06
console.log(ts.encode(str1, 1)) // <Buffer 00 01 00 06 e6 98 8a e6 b7 bc>

let encodeBuf = ts.encode(str1, 1)

/*let a = ts.decode(encodeBuf)
console.log(a) */

let len = ts.getPackageLen(encodeBuf)
console.log(len)