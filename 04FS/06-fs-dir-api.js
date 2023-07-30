const fs = require('fs')

// 一、access 
// 是否有操作权限 ，可以判断文件是存在
// fs.access('a.txt', (err) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('有操作权限')
//   }
// }) 

// 二、stat 
// 获取文件、目录信息
// fs.stat('a', (err, statObj) => {
//   console.log(statObj)
//   console.log(statObj.size)
//   console.log(statObj.isFile())
//   console.log(statObj.isDirectory())
// }) 

// 三、mkdir 
// 创建目录
// 需要保证父级目录是存在的，如果不存在我们可以指定{recursive: true}递归创建
// fs.mkdir('a/b/c.txt', {recursive: true}, (err) => {
//   if (!err) {
//     console.log('创建成功')
//   }else{
//     console.log(err)
//   }
// }) 

// 四、rmdir
// 删除目录
// 默认只删除最后一级目录/文件
// 当目录不为空，则不能删除，如果想要强制删除，我们需要添加 {recursive: true}

fs.rmdir('a/a.txt', {recursive: true}, (err) => {
  if (!err) {
    console.log('删除成功')
  } else {
    console.log(err)
  }
})

// 五、readdir 
// 只会返回当前层级的目录和文件
// 路径不存在则返回undefined
// fs.readdir('a/b', (err, files) => {
//   console.log(files)
// }) 

// 六、unlink
// 删除指定文件, 给定的路径必须是文件路径，否者报错
// fs.unlink('a', (err) => {
//   if (!err) {
//     console.log('删除成功')
//   }else {
//     console.log("err", err)
//   }
// }) 