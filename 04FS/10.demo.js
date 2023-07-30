const fs = require("fs")

// // 当文件根目录存在的话，即使使用了递归创建也会报错。a/b/c 如果a已经存在并且内部有其他文件，创建时将会报错。 这种说法是错误的

// 如果有同名文件将创建会报错。
// fs.mkdir("a/b/c/d", {recursive: true}, (err, data) => {
//   console.log(err, data)
// })



console.log(this) // this指向exports