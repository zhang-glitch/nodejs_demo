const fs = require('fs')

// read ： 所谓的读操作就是将数据从磁盘文件中写入到 buffer 中
let buf = Buffer.alloc(10)

/**
 * fs.read(fd, buf, offset, length, position)
 * fd 定位当前被打开的文件 
 * buf 用于表示当前缓冲区
 * offset 表示当前从 buf 的哪个位置开始执行写入
 * length 表示当前次写入的长度
 * position 表示当前从文件的哪个位置开始读取
 * 
 * 注意：指定缓存区的数量必须大于等于读取的长度。否则报错
 */
 fs.open('04FS/a.txt', 'r', (err, rfd) => {
  fs.read(rfd, buf, 0, 4, 0, 
    // data就是一个buffer数据 
    // readBytes 读取的buffer长度
    (err, readBytes, data) => {
    console.log(readBytes) // 4
    console.log(data)
    console.log(data.toString())

    fs.read(rfd, buf, 0, 4, 4, 
      // data就是一个buffer数据 
      // readBytes 读取的buffer长度
      (err, readBytes, data) => {
        // 第二次只能读取一个字节，所以buffer后面的内容不变，第一个字节变成5
      console.log(readBytes) // 1
      console.log(data)
      console.log(data.toString())
    })
  })
}) 

// write 将缓冲区里的内容写入到磁盘文件中
/**
 * fs.write(fd, buf, offset, length, position)
 * fd 定位当前被打开的文件 
 * buf 用于表示当前缓冲区
 * offset 表示当前从 buf 的哪个位置开始执行读取
 * length 表示当前次写入的长度
 * position 表示当前从文件的哪个位置写入读取
 * 
 */
// buf = Buffer.from('1234567890')
// // 这里的关于写的操作描述符(w, w+, r+)都一样，我们可以在下面控制写入的位置
// fs.open('04FS/b.txt', 'r+', (err, wfd) => {
//   // written 每次写入的字节数
//   // buffer 缓冲区
//   fs.write(wfd, buf, 2, 4, 0, (err, written, buffer) => {
//     console.log(written, '----')
//     // 我们再次写入时，就需要指定写入的位置4
//     fs.write(wfd, buf, 2, 4, 4, (err, written, buffer) => {
//       console.log(written, '----')
//       fs.close(wfd)
//     })
//   })
// })