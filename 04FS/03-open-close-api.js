const fs = require('fs')
const path = require('path')

// open 
/**
 * 文件不存在将报错
 * 
 * 可以拿到文件标识符
 */
// fs.open(path.resolve(__dirname, 'a.txt'), 'r', (err, fd) => {
//   console.log(fd) // 3
// }) 

// close
fs.open(path.resolve(__dirname, 'a.txt'), 'r', (err, fd) => {
  console.log(fd)
  fs.close(fd, err => {
    console.log('关闭成功')
  })
})