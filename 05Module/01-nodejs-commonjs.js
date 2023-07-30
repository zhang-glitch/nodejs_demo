// 一、导入
/* let obj = require('./m')
console.log(obj) */

// 二、module
// let obj = require('./m')

// 三、exports
/* let obj = require('./m')
console.log(obj) */

// 四、同步加载
/* let obj = require('./m')
console.log('01.js代码执行了') */

// let obj = require('./m')
let obj = require('./demo')
// 主模块就是当前模块对象
console.log(require.main == module)
// console.log(require.resolve("./m")) // 返回指定路径的绝对路径 C:\Users\张昊\Desktop\新建文件夹 (5)\code\Code\05Module\m.js

console.log(module.parent) // null
