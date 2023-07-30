const fs = require('fs')
const path = require('path')

// readFile
/**
 * 默认读取的是二进制数据，如果想要读取文本，我们需要在第二个参数指定utf-8
 */
// fs.readFile('04FS/a.txt', "utf-8",  (err, data) => {
//   if (!err) {
//     console.log(data)
//   }
// }) 

// writeFile 
/**
 * 路径不存在会自动创建
 */
// fs.writeFile('04FS/a.txt', 'ii', {
//   mode: 438,
//   // w+默认值会覆盖源文件数据，a, a+, r+不会覆盖原文件数据。
//   // r+表示从开始替换
//   flag: 'r+',
//   encoding: 'utf-8'
// }, (err) => {
//   if (!err) {
//     fs.readFile('04FS/a.txt', 'utf-8', (err, data) => {
//       console.log(data)
//     })
//   }
// }) 

// 追加内容
/**
 * 路径不存在会创建
 */

// fs.appendFile('04FS/a1.txt', 'hello node.js',{},  (err) => {
//   console.log('写入成功')
// }) 

// copyFile
/**
 * 直接覆盖目标文件（先清空再写入）
 * 
 * 源文件可以不存在
 */
// fs.copyFile('04FS/a222.txt', '04FS/a1.txt', () => {
//   console.log('拷贝成功')
// }) 

// watchFile
/**
 * {interval: 20} 每20ms监控一次
 */
fs.watchFile('04FS/a.txt', {interval: 20}, (curr, prev) => {
  // curr：修改之后的文件对象
  // prev：修改之前的文件对象
  if (curr.mtime !== prev.mtime) {
    console.log('文件被修改了')
    // 取消监听
    fs.unwatchFile('04FS/a.txt')
  }
})