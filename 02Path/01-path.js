const path = require('path')

// console.log(__filename)

// 1 获取路径中的基础名称 
/**
 * 01 返回的就是接收路径当中的最后一部分 
 * 02 第二个参数表示扩展名，如果说没有设置则返回完整的文件名称带后缀
 * 03 第二个参数做为后缀时，如果没有在当前路径中被匹配到，那么就会忽略
 * 04 处理目录路径的时候如果说，结尾处有路径分割符，则也会被忽略掉
 */
console.log(path.basename(__filename)) // 01-path.js
console.log(path.basename(__filename, '.js')) // 01-path.js
console.log(path.basename(__filename, '.css')) // 01-path.js
// 会忽略后面的分隔符
// console.log(path.basename('/a/b/c')) // c
// console.log(path.basename('/a/b/c/')) // c

// 2 获取路径目录名 (路径)
/**
 * 01 返回路径中最后一个部分的上一层目录所在路径
 */

console.log(path.dirname(__filename)) // __dirname
// console.log(path.dirname('/a/b/c')) // /a/b
// console.log(path.dirname('/a/b/c/')) // /a/b

// 3 获取路径的扩展名
/**
 * 01 返回 path路径中相应文件的后缀名(包括点)
 * 02 如果 path 路径当中存在多个点，它匹配的是最后一个点，到结尾的内容
 */

// console.log(path.extname(__filename))
// console.log(path.extname('/a/b')) // ""
// console.log(path.extname('/a/b/index.html.js.css'))
// console.log(path.extname('/a/b/index.html.js.')) // "."

// 4 解析路径
/**
 * 01 接收一个路径，返回一个对象，包含不同的信息
 * 02 root dir base ext name
 */
// const obj = path.parse('/a/b/c/index.html')
// // const obj = path.parse('/a/b/c/')
// // const obj = path.parse('./a/b/c/')
// console.log(obj) 
// {
//   root: '/',
//   dir: '/a/b/c', // path.dirname()
//   base: 'index.html', // path.basename()
//   ext: '.html', // path.extname()
//   name: 'index' // path.basename(path, ext)
// }

// 5 序列化路径
// const obj = path.parse('./a/b/c/')
// console.log(path.format(obj)) // ./a/b\c

// 6 判断当前路径是否为绝对
// console.log(path.isAbsolute('foo'))
// console.log(path.isAbsolute('/foo'))
// console.log(path.isAbsolute('///foo')) // true
// console.log(path.isAbsolute(''))
// console.log(path.isAbsolute('.'))
// console.log(path.isAbsolute('../bar'))

// 7 拼接路径
/**
 * 返回拼接后的相对路径 / 绝对路径。取决于第一个参数
 * 
 * 会识别../
 */
// console.log(path.join('a/b', 'c', 'index.html'))
// console.log(path.join('/a/b', 'c', 'index.html'))
// console.log(path.join('/a/b', 'c', '../', 'index.html'))
// console.log(path.join('/a/b', 'c', './', 'index.html'))
// console.log(path.join('/a/b', 'c', '', 'index.html'))
// console.log(path.join(''))  // . 当前工作目录

// 8 规范化路径
// 可识别转义字符
// console.log(path.normalize(''))
// console.log(path.normalize('a/b/c/d'))
// console.log(path.normalize('a///b/c../d')) // a\b\c..\d
// console.log(path.normalize('a//\\/b/c\\/d'))
// console.log(path.normalize('a//\\b/c\\/d'))  // a\b\c\d
// console.log(path.normalize('a//\b/c\\/d'))  // a\c\d

// 9 绝对路径
// 返回绝对路径
// console.log(path.resolve()) // process.cwd()
/**
 * resolve([from], to)
 * 他会根据参数是否是绝对路径来进行返回，如果是就直接返回拼接好的，否则返回对应盘符的
 * 
 * 就是把to的部分拼接成一个绝对路径。
 * from就是尽可能多的相对路径参数，然后拼接时将忽略
 */
console.log(path.resolve('/a', 'b')) // C:\a\b
console.log(path.resolve('/a', '/b')) // C:\b
console.log(path.resolve('/a', '../b')) // C:\b
console.log(path.resolve('index.html')) // __dirname + "index.html"
