---
theme: nico
---
# nodejs可以做什么？
- 轻量级、高性能的 Web 服务

- 前后端 JavaScript 同构开发

- 便捷高效的前端工程化

# nodejs架构

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7b1041686f647598782bd8e8333fb60~tplv-k3u1fbpfcp-watermark.image?)
## Natives modules
- 当前层内容由 JS 实现

- 提供应用程序可直接调用库，例如fs、path、http等

- JS 语言无法直接操作底层硬件设置，所以还需要下层c/c++进行配合。

## 底层

- V8：执行 JS 代码，提供桥梁接口（操作js执行底层操作）。

- Libuv：事件循环、事件队列、异步IO。

- 第三方模块：zlib 、http、c-ares等。

对于传统的高级语言，在实现IO操作的时候，都是采用并发处理，但是这样的话，如果同一时间事情过多，我们不可能无限的开启线程处理，所以就可能造成阻塞，这就体现了Nodejs异步非阻塞IO的优势了。通过一个线程来实现多个线程做的事情。**所以对于IO密集型的高并发请求Nodejs有着天然的优势。但是对于cpu密集型的处理就有着天然的劣势。**

Nodejs单线程配合事件驱动架构及libuv实现异步IO。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9bbaca01f02416fa9d964a1b2063176~tplv-k3u1fbpfcp-watermark.image?)

事件驱动架构

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2abb03bc1c684191936c234f2cffc2f3~tplv-k3u1fbpfcp-watermark.image?)

单线程如何实现高并发？
- Nodejs主线程是单线程的，v8执行Nodejs代码，v8只有一个主线程执行js代码。但是libuv库存在一个线程池，来帮助我们异步执行IO操作。

- 异步非阻塞IO配合事件回调通知。
# Nodejs应用场景

nodejs作为中间层。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cd148353e6b4c20a4eea1a06cedaa7b~tplv-k3u1fbpfcp-watermark.image?)

实时聊天应用程序。

操作数据库提供API服务。

总之Nodejs适用于IO密集型任务。
# 全局对象 / 变量
在nodejs中，global是全局变量的寄主。

全局中的this和global不一样，全局this指向{}
```js
// 在模块化调用中，this被赋值为{}
console.log(this == global); // false


(function () {
  console.log(this == global) // true
})()
```

Nodejs 常见全局变量
## 常用变量

- ＿filename：返回正在执行脚本文件的绝对路径

- ＿dirname：返回正在执行脚本所在目录

- timer类函数：执行顺序与事件循环间的关系

- process：提供与当前进程互动的接口
```js
// 1 资源： cpu 内存
console.log(process.memoryUsage())
// {
//   rss: 19881984, // 常驻内存
//   heapTotal: 4481024, // 申请的内存
//   heapUsed: 2710648, // 使用的内存
//   external: 893780, // 底层c、c++模块占用内存
//   arrayBuffers: 9898 // 独立空间大小，缓存区大小
// }
// console.log(process.cpuUsage()) // cpu占用时间片段

// 2 运行环境：运行目录、node环境、cpu架构、用户环境、系统平台
/* console.log(process.cwd())
console.log(process.version)
console.log(process.versions) // 相关库的版本
console.log(process.arch) // x64
console.log(process.env.NODE_ENV)
console.log(process.env.PATH) // 系统环境变量
console.log(process.env.USERPROFILE)  // 用户目录
console.log(process.platform) */

// 3 运行状态： 启动参数、PID、运行时间
/* console.log(process.argv)
console.log(process.argv0)  // execArgv
console.log(process.pid) */  // ppid 

setTimeout(() => {
  console.log(process.uptime())
}, 3000)
```
事件操作
```js
// 事件操作
process.on("exit", function() {
  console.log("exit...")
})

process.on("beforeExit", function() {
  console.log("before exit...")
})

// 主动退出
process.exit() // 手动退出并不会触发beforeExit
```
流操作
```js
// process.stdin.pipe(process.stdout)


process.stdin.setEncoding("utf-8")
process.stdin.on("readable", () => {
  const chunk = process.stdin.read() // 从输入中取出数据
  if(!chunk) {
    process.stdout.write("输出" + chunk)
  }
})
```
- require：实现模块的加载

- module、exports：处理模块的导出
## Buffer
流也可以理解为一个数据结构，用于存储数据的，可以分段。对于大文件读取，可以避免超过内存过大占满内存，通过流操作配合管道可以将数据一段一段的传递。

**buffer就是一片内存空间。可以实现Nodejs下二进制数据操作。不占据V8堆内存大小的内存空间，由c++底层分配内存，但是内存的回收还是由V8的GC去控制。一般配合Stream流进行使用，充当数据缓存区。**

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce0f11f5380c46d68bbe3fe9df692639~tplv-k3u1fbpfcp-watermark.image?)

### 创建buffer对象
- alloc：创建指定字节大小的 buffer

- allocUnsafe：创建指定大小的 buffer（不安全）

- from：接收数据，创建 buffer
```js
// const b1 = Buffer.alloc(10)
// // 创建的内存可能会有数据，该内存没有对象指向就可以被拿来创建内存，但是可能会有数据存在。
// const b2 = Buffer.allocUnsafe(10)

// console.log(b1)
// console.log(b2) 

// from 
/**
 * 字符串
 * 数组
 * buffer对象
 */
// const b1 = Buffer.from('1')
// console.log(b1) 

// const b1 = Buffer.from([0xe4, 0xb8, 0xad])
// const b1 = Buffer.from([0x60, 0b1001, 12]) // 60 09 0c 
// const b1 = Buffer.from(["张", 1], "utf") // 直接传入汉字不能识别，需要转成进制才可以传入
// console.log(b1)  // <Buffer 00 01>
// console.log(b1.toString()) 

const b1 = Buffer.alloc(3)
const b2 = Buffer.from(b1) // 重新拷贝一份，修改b1不会影响b2

// console.log(b1) // <Buffer 00 00 00>
// console.log(b2)

b1[0] = 1
console.log(b1) // <Buffer 01 00 00>
console.log(b2) // <Buffer 00 00 00>
```
### 实例方法

- fill：使用数据填充 buffer

- write：向 buffer 中写入数据

- toString：从 buffer 中提取数据

- slice：截取 buffer

- indexOf：在 buffer 中查找数据

- copy：拷贝 buffer 中的数据

```js
let buf = Buffer.alloc(5)

// fill 将缓冲区填满
/**
 * (data, start, end)
 * 可以指定从哪个位置开始填充
 * 可以指定从哪个位置结束
 * 前闭后开
 */
// buf.fill("123", 1,3)
// console.log(buf)
// console.log(buf.toString()) 

// write 
/**
 * 有多少数据就写多少个，多余的剔除
 * (data, start, length)
 * 可以指定从哪个位置开始填充
 * 写入数据的字节数
 */

// buf.write('12345', 0, 4)
// console.log(buf)
// console.log(buf.toString())

// toString
/**
 * (data, start, end)
 * 可以指定从哪个位置开始读取
 * 可以指定从哪个位置结束
 * 前闭后开
 */
// buf = Buffer.from('123456')
// console.log(buf)
// console.log(buf.toString('utf-8', 1, 3)) // 23

// slice 
/**
 * (data, start, end)
 * 可以指定从哪个位置开始截取
 * 可以指定从哪个位置结束
 * 前闭后开
 */
// buf = Buffer.from('123456789')
// let b1 = buf.slice(-3)
// console.log(b1)
// console.log(b1.toString())  // 789

// indexOf
// 返回字节对应的下标, 如果传入的中文需要注意
// buf = Buffer.from('123045607890111213')
// console.log(buf)
// console.log(buf.indexOf('0', 3)) // 3

// copy 
/**
 * (目标, 从目标第几个位置写入, 从源第一个位置开始读取，从源第几个位置结束读取)
 * 
 * 前闭后开
 */
let b1 = Buffer.alloc(6)
let b2 = Buffer.from('123456')

b2.copy(b1, 3, 3, 5)
console.log(b1.toString()) // 45
console.log(b2.toString()) // 123456
```
### 静态方法
- concat: 将多个 buffer 拼接成一个新的 buffer。参数是一个buffer数组。

- isBuffer：判断当前数据是否为 buffer

```js
/**
 * 可以指定拼接的长度
 */
const b1 = Buffer.from([1,2,3])
const b2 = Buffer.from([3,4,5])
console.log(Buffer.concat([b1, b2], 2)) // <Buffer 01 02>


console.log(Buffer.isBuffer(b1))
```
# 核心模块
## path
```js
const path = require('path')

// console.log(__filename)

// 1 获取路径中的基础名称 
/**
 * 01 返回的就是接收路径当中的最后一部分 
 * 02 第二个参数表示扩展名，如果说没有设置则返回完整的文件名称带后缀
 * 03 第二个参数做为后缀时，如果没有在当前路径中被匹配到，那么就会忽略
 * 04 处理目录路径的时候如果说，结尾处有路径分割符，则也会被忽略掉
 */
// console.log(path.basename(__filename))
// console.log(path.basename(__filename, '.js'))
// console.log(path.basename(__filename, '.css'))
// 会忽略后面的分隔符
// console.log(path.basename('/a/b/c')) // c
// console.log(path.basename('/a/b/c/')) // c

// 2 获取路径目录名 (路径)
/**
 * 01 返回路径中最后一个部分的上一层目录所在路径
 */

// console.log(path.dirname(__filename))
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
console.log(path.resolve('index.html'))
```

## fs
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/710c460afa96498685312b3b707e39bf~tplv-k3u1fbpfcp-watermark.image?)
### 三个基本概念

权限位：用户对于文件所具备的操作权限。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a655b79226c14afda22e7e6161626cfb~tplv-k3u1fbpfcp-watermark.image?)

操作符：nodejs通过flag表示对文件的操作方式。

文件标识符：fd就是操作系统分配给被打开文件的标识，当文件被打开，操作系统就会分配一个数字标识。从3开始
### fs api
- readFile：从指定文件中读取数据

- writeFile：向指定文件中写入数据

- appendFile：追加的方式向指定文件中写入数据

- copyFile：将某个文件中的数据拷贝至另一文件

- watchFile：对指定文件进行监控
```js

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
```
### 文件打开与关闭
上面的文件读取和写入都是一次性的，但是对于大文件读取写入，显然是不合理的。所以Nodejs将文件的打开读取写入关闭单独设计。
```js
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
```
### 文件分段读取和写入
```js
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
//  fs.open('04FS/a.txt', 'r', (err, rfd) => {
//   fs.read(rfd, buf, 1, 4, 3, 
//     // data就是一个buffer数据 
//     // readBytes 读取的buffer长度
//     (err, readBytes, data) => {
//     console.log(readBytes)
//     console.log(data)
//     console.log(data.toString())
//   })
// }) 

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
buf = Buffer.from('1234567890')
// 这里的关于写的操作描述符(w, w+, r+)都一样，我们可以在下面控制写入的位置
fs.open('04FS/b.txt', 'r+', (err, wfd) => {
  // written 每次写入的字节数
  // buffer 缓冲区
  fs.write(wfd, buf, 2, 4, 0, (err, written, buffer) => {
    console.log(written, '----')
    // 我们再次写入时，就需要指定写入的位置4
    fs.write(wfd, buf, 2, 4, 4, (err, written, buffer) => {
      console.log(written, '----')
      fs.close(wfd)
    })
  })
})
```
### 手写分段文件拷贝
```js
/**
 * 01 打开 a 文件，利用 read 将数据保存到 buffer 暂存起来
 * 02 打开 b 文件，利用 write 将 buffer 中数据写入到 b 文件中
 */
    function copyFile(src, dest) {
      let buf = Buffer.alloc(10)
      const BUFFER_SIZE = buf.length
      let readOffset = 0

      fs.open(path.resolve(__dirname, src), 'r', (err, rfd) => {
        fs.open(path.resolve(__dirname, dest), 'w', (err, wfd) => {
          function next () {
             //从buf的0位置开始放，读取10个字节，从文件的0、0+readBytes、...位置开始读取
            fs.read(rfd, buf, 0, BUFFER_SIZE, readOffset, (err, readBytes) => {
              if (!readBytes) {
                // 如果条件成立，说明内容已经读取完毕
                fs.close(rfd, ()=> {})
                fs.close(wfd, ()=> {})
                console.log('拷贝完成')
                return
              }
              // 从buf的0位置开始读, 写入readBytes字节，从文件readOffset(读多少写多少)位置开始写入
              fs.write(wfd, buf, 0, readBytes, readOffset, (err, written) => { 
                readOffset += readBytes
                next()
              })
            })
          }
          next()
        })
      })
    }

    copyFile("a.txt", "b.txt")
```
### 目录操作
- access: 判断文件或目录是否具有操作权限

- stat：获取目录及文件信息

- mkdir：创建目录

- rmdir：删除目录

- readdir：读取目录中内容

- unlink：删除指定文件
```js
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
// fs.stat('a.txt', (err, statObj) => {
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

// fs.rmdir('b', {recursive: true}, (err) => {
//   if (!err) {
//     console.log('删除成功')
//   } else {
//     console.log(err)
//   }
// })

// 五、readdir 
// 只会返回当前层级的目录和文件
// 路径不存在则返回undefined
// fs.readdir('a/b', (err, files) => {
//   console.log(files)
// }) 

// 六、unlink
// 删除指定文件, 给定的路径必须是文件路径，否者报错
fs.unlink('a', (err) => {
  if (!err) {
    console.log('删除成功')
  }else {
    console.log("err", err)
  }
}) 
```
### 手写文件递归创建
同步，异步，promise写法
```js
const fs = require('fs')
const path = require('path')

/**
 * 01 将来调用时需要接收类似于 a/b/c ，这样的路径，它们之间是采用 / 去行连接
 * 02 利用 / 分割符将路径进行拆分，将每一项放入一个数组中进行管理  ['a', 'b', 'c']
 * 03 对上述的数组进行遍历，我们需要拿到每一项，然后与前一项进行拼接 /
 * 04 判断一个当前对拼接之后的路径是否具有可操作的权限，如果有则证明存在，否则的话就需要执行创建
 */

function makeDirSync (dirPath) {
  let items = dirPath.split(path.sep)
  for(let i = 1; i <= items.length; i++) {
    let dir = items.slice(0, i).join(path.sep)
    try {
      // 没有该文件，将报错，然后就会在catch中创建。
      fs.accessSync(dir)
    } catch (err) {
      fs.mkdirSync(dir)
    }
  }
}
```
```js
const fs = require('fs')
const path = require('path')
const {promisify} = require('util')

/* function mkDir (dirPath, cb) {
  let parts = dirPath.split('/')
  let index = 1

  function next () {
    if (index > parts.length) return cb && cb()

    let current = parts.slice(0, index++).join('/')

    fs.access(current, (err) => {
      if (err) {
        fs.mkdir(current, next)
      }else{
        next()
      }
    })
  }
  next()
}

mkDir('a/b/c', () => {
  console.log('创建成功')
}) */


// 将 access 与 mkdir 处理成 async... 风格
const access = promisify(fs.access)
const mkdir = promisify(fs.mkdir)

async function myMkdir (dirPath, cb) {
  let parts = dirPath.split('/')
  for(let index = 1; index <= parts.length; index++) {
    let current = parts.slice(0, index).join('/')
    try {
      await access(current)
    } catch (err) {
      await mkdir(current)
    }
  }
  cb && cb()
}

myMkdir('a/b/c', () => {
  console.log('创建成功')
})
```
### 手写删除文件/文件夹
```js
const { dir } = require('console')
const fs = require('fs')
const path = require('path')

/**
 * 需求：自定义一个函数，接收一个路径，然后执行删除
 * 01 判断当前传入的路径是否为一个文件，直接删除当前文件即可
 * 02 如果当前传入的是一个目录，我们需要继续读取目录中的内容，然后再执行删除操作
 * 03 将删除行为定义成一个函数，然后通过递归的方式进行复用
 * 04 将当前的名称拼接成在删除时可使用的路径
 */
function myRmdir (dirPath, cb) {
  // 判断当前 dirPath 的类型
  fs.stat(dirPath, (err, statObj) => {
    if (statObj.isDirectory()) { // b // c
      // 目录---> 继续读取
      fs.readdir(dirPath, (err, files) => {
        let dirs = files.map(item => { // c // d
          return path.join(dirPath, item)
        })
        let index = 0
        function next () {
          // 只有遍历到最后一层级再删除。如果该文件夹还有内容，就继续递归。直到dirs为空
          if (index == dirs.length) return fs.rmdir(dirPath, cb)

          let current = dirs[index++]

          myRmdir(current, next) 
        }

        next()

        // for(let file of dirs) {
        //   myRmdir(current, next)
        // }
      })
    } else {
      // 文件---> 直接删除
      fs.unlink(dirPath, cb)
    }
  })
}

myRmdir('b', () => {
  console.log('删除成功了')
})
```
文件写入流过程分析

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26e2d4b443f04106962b33ce3f9afabb~tplv-k3u1fbpfcp-watermark.image?)
# 模块化
## module属性

- id: 返回模块标识符, 一般是一个绝对路径

- filename:返回文件模块的绝对路径

- loaded: 返回布尔值, 表示模块是否完成加载

- parent: 返回对象存放调用当前模块的模块

- children: 返回数组, 存放当前模块调用的其它模块

- exports: 返回当前模块需要暴露的内容

- paths: 返回数组, 存放不同目录下的node modules 位置

## require 属性
- resolve:返回模块文件绝对路径
```js
console.log(require.resolve("./m")) // 返回指定路径的绝对路径
```
- extensions:依据不同后缀名执行解析操作

- main:返回主模块对象

**require.main表示入口文件，就是顶级文件。未被其他文件导入的文件。**

如果该文件被引入，那么require.main就指向入口文件。
```js
// require.main指向入口文件
console.log(module.parent.parent.parent... === require.main) // true
```
## commonjs模块化加载源码解析
nodejs中的内置模块在nodejs运行的时候就已经被作为二进制加载到内存中，require时直接在内存中取出。

### 加载流程分析
- 路径分析：确定目标模块位置 (内置，第三方（module.paths），本地)

- 文件定位：确定目标中的具体文件。（js/json/node -> package.json中的main -> index.js/json/node）

- 编译执行：对模块内容进行编译，返回可用的exports对象。(js -> 函数调用，传递参数。json -> JSON.parse())

### 源码解析
- relResolveCacheIdntifier 根据路径查找该路径是否被缓存。
- 无，解析并补全路径为完整的路径
- 根据路径查找模块是否被缓存。
- 是否是内置模块
- 创建一个module对象，并缓存该模块。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c88d281ab7e4e88b03fdfd80db142a3~tplv-k3u1fbpfcp-watermark.image?)
- module.load() 初始化一些模块属性。
- 通过后缀取出对应的函数。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e38bbe3fb0a4e87aa93a0aba03a4985~tplv-k3u1fbpfcp-watermark.image?)
- 函数内通过**readFileSync同步加载文件**内容。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7754a8f90aa44c1857de8745539a2e4~tplv-k3u1fbpfcp-watermark.image?)
- module._compile() 内部将文件内容包裹在一个全局函数中。即每个模块的作用域函数。
- 通过获取require、exports、module、__dirname、__filename传入并调用全局函数，返回结果。其中this被绑定为空对象。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea86029673ad4004a2000772178fd3e3~tplv-k3u1fbpfcp-watermark.image?)
## 自己实现commonjs模块化
- 通过fs.readFileSync读取文件，`eval`执行字符串。

缺点：没有自己的作用域。
```js
    const fs = require("fs")

    const content = fs.readFileSync("./demo.js", "utf-8") // var  a = 10

    eval(content)

    console.log("a", a) // 10
```
- 通过Function执行字符串。

缺点：定义麻烦。
```js

const fs = require("fs")

const content = fs.readFileSync("./demo.js", "utf-8") // var  a = 10

const fn = new Function("", `${content} return a`);

console.log(fn()) // 10
```
- 通过nodejs内置的核心模块`VM`

可以创建一个独立运行的沙箱环境。
```js

const fs = require("fs")
const vm = require("vm")

const b = 100
a = 100 // 可以被使用
const content = fs.readFileSync("./demo.js", "utf-8") // var  a = 10


// vm.runInThisContext(content) // 内部是一个沙箱，不能使用外部变量。但是外部可以使用沙箱内的内容
// console.log(a) // 10

vm.runInThisContext("a = a + 10") // 但是沙箱内可以使用外部为使用声明定义的变量
console.log(a) // 110
```
实现
```js
const { dir } = require('console')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module (id) {
  // 存储文件路径
  this.id = id
  // 存储导出内容
  this.exports = {}
}

// 分析传入的路径
Module._resolveFilename = function (filename) {
  // 利用 Path 将 filename 转为绝对路径
  let absPath = path.resolve(__dirname, filename)
  
  // 判断当前路径对应的内容是否存在（）
  if (fs.existsSync(absPath)) { // 这里查到文件夹也是可以通过的
    // 如果条件成立则说明 absPath 对应的内容是存在的
    // 如果是文件夹取index.js，否则抛出错误
    if(fs.statSync(absPath).isDirectory()) {
      if(fs.existsSync(path.join(absPath, "index.js"))) {
        return path.join(absPath, "index.js")
      }else {
        throw new Error(`${filename} is not exists`)
      }
    }else {
      return absPath
    }
  } else {
    // 文件定位
    let suffix = Object.keys(Module._extensions)

    for(var i=0; i<suffix.length; i++) {
      let newPath = absPath + suffix[i]
      if (fs.existsSync(newPath)) {
        return newPath
      }
    }
  }
  throw new Error(`${filename} is not exists`)
}

// 定义查询的扩展名和函数映射
Module._extensions = {
  '.js'(module) {
    // 读取
    let content = fs.readFileSync(module.id, 'utf-8')

    // 包装
    content = Module.wrapper[0] + content + Module.wrapper[1] 
    
    // VM 
    let compileFn = vm.runInThisContext(content)

    // 准备参数的值
    let exports = module.exports
    let dirname = path.dirname(module.id)
    let filename = module.id

    // 调用
    compileFn.call(exports, exports, myRequire, module, filename, dirname)
  },
  '.json'(module) {
    let content = JSON.parse(fs.readFileSync(module.id, 'utf-8'))

    module.exports = content
  }
}

Module.wrapper = [
  "(function (exports, require, module, __filename, __dirname) {",
  "})"
]

// 缓存对象 （绝对路径：module对象）
Module._cache = {}

// 加载模块，取出扩展名执行对应函数
Module.prototype.load = function () {
  let extname = path.extname(this.id)
  
  Module._extensions[extname](this)
}

function myRequire (filename) {
  // 1 绝对路径
  let mPath = Module._resolveFilename(filename)
  
  // 2 缓存优先
  let cacheModule = Module._cache[mPath]
  if (cacheModule) return cacheModule.exports

  // 3 创建空对象加载目标模块
  let module = new Module(mPath)

  // 4 缓存已加载过的模块
  Module._cache[mPath] = module

  // 5 执行加载（编译执行）
  module.load()

  // 6 返回数据
  return module.exports
}
```
# events

- node.js 是基于事件驱动的异步操作架构，内置events模块

- events 模块提供了 EventEmitter类

- node.js 中很多内置核心模块继承EventEmitter

这部分比较简单，就不过于介绍了。
## 事件循环

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73fdac38c8d94a6f825e9b59bfc05b1f~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1919865650824c83a78a1c9f7692eb4a~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b76cff645e7a4e79bd4794bcf0c2e1d4~tplv-k3u1fbpfcp-watermark.image?)
# stream
nodejs诞生之初是为了提高IO性能，所以文件操作系统和网络模块实现了流接口。

nodejs的流就是处理流式数据的抽象接口。

不通过流来读取文件的缺陷
- 同步读取资源文件，用户需要等待数据读取完成

- 资源文件最终一次性加载至内存，开销较大

流操作的用途
- 数据分段传输。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce55a65f77884fa49910286f83e208c6~tplv-k3u1fbpfcp-watermark.image?)
- 通过管道对分段数据进行加工。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0820855c0d2344f38eca52d8eb284fbb~tplv-k3u1fbpfcp-watermark.image?)

流处理数据的优势

- **时间效率**：流的分段处理可以同时操作多个数据 chunk

- **空间效率**：同一时间流无须占据大内存空间

- **使用方便**：流配合管理，扩展程序变得简单

## Node.js 中流的分类

- Readable：可读流，能够实现数据的读取

- Writeable：可写流，能够实现数据的写操作

- Duplex：双工流，既可读又可写。**读和写的数据是分离的。**

- Tranform：转换流，可读可写，还能实现数据转换。**将读写操作进行连通。**

## Nodejs中流的特点
- Stream模块实现了上述四个具体的抽象

- 所有的流都继承自EventEmitter，都可以通过监听内置事件来处理数据。

## 自定义可读流

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76c2bd726e72440e97d7abaae1419b94~tplv-k3u1fbpfcp-watermark.image?)
```js
const {Readable} = require('stream')

// 模拟底层数据
let source = ['zh', 'llm', 'hh']

// 自定义类继承 Readable
class MyReadable extends Readable{
  constructor(source) {
    super()
    this.source = source
  }
  // 提供数据消费
  _read() {
    // 将数据放在缓存区
    let data = this.source.shift() || null 
    this.push(data)
  }
}

// 实例化
let myReadable = new MyReadable(source)

/**
 * 
 * 两种读取方式
 * - readable：将数据读取到缓存区，然后在进行消费（暂停模式）
 * - data：数据远远不断地输出，可以直接消费 （流动模式）
 */
myReadable.on('readable', () => {
  let data = null 
  // read方法可以设置指定的读取长度
  while((data = myReadable.read(2)) != null) {
    console.log(data.toString())
  }
}) 

// myReadable.on('data', (chunk) => {
//   console.log(chunk.toString())
// })
```
## 自定义可写流
```js
const { Writable } = require('stream')

class MyWriteable extends Writable {
  constructor() {
    super()
  }
  _write(chunk, en, done) {
    // 将数据输出到控制台
    process.stdout.write(chunk.toString() + '\n')
    // 执行传入的回调
    process.nextTick(done)
  }
}

let myWriteable = new MyWriteable()

myWriteable.write('我是zhang-glitch', 'utf-8', () => {
  console.log('end')
})
```
## 自定义Duplex双工流
读和写的数据是分离的。
```js
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

```
## 自定义一个Transform双工流
写入和读取的数据是相通的。
```js
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
```
## 文件流
### 文件可读流
两种读取方式
- data。读取时不经过缓冲区，直接读取。我们可以调用pause, resume来实现为readable模式。
- readable。读取缓存区的存在的数据。如果该数据长度为0，就会重新触发_read进行数据读取到缓存区。读取的长度就是highWaterMark定义的长度。

由于我们是按照字节为单位分段读取，中间过程是无用的，所以我们一般都会将数据缓存在buffer中，当读取完毕后，统一处理。
```js
const fs = require('fs')

let rs = fs.createReadStream('test.txt', {
  // 操作符
  flags: 'r',
  // buffer的形式读取
  encoding: null, 
  // 标识符
  fd: null,
  // 权限位
  mode: 438,
  // 自动关闭文件
  autoClose: true, 
  // 表示读取范围，头尾都包 （开始读取）
  start: 0,
  // 结束读取 
  // end: 3,
  // 每次读取几个字节数据。即buffer缓冲区长度 默认是64kb
  highWaterMark: 3
})

// data事件中的 rs._readableState.length 始终是0,所以我们读取时并不在缓冲区中读取
// rs.on('data', (chunk) => {
//   console.log(chunk.toString())
//   // 通过pause, resume可以实现暂停模式读取文件
//   // 暂停读取
//   // rs.pause()
//   // setTimeout(() => {
//   //   // 开始读取
//   //   rs.resume()
//   // }, 1000)
// }) 

// 会自动触发该事件，知道数据读取完成
// rs.on('readable', () => {
//   // let data = rs.read()
//   // console.log(data?.toString())
//   let data
//   while((data = rs.read(1)) !== null) {
//     console.log(data.toString())
//     // 读取缓存区的存在的数据。如果该数据长度为0，就会重新触发_read进行数据读取到缓存区。读取的长度就是highWaterMark定义的长度
//     console.log('----------', rs._readableState.length)
//   }
// }) 



// createReadStream调用后就会触发
// rs.on('open', (fd) => {
//   console.log(fd, '文件打开了')
// })

// 数据消费完毕出发
// rs.on('close', () => {
//   console.log('文件关闭了')
// })


// 数据读取是分段的，我们需要拿到读取的所有buffer，然后在处理
let bufferArr = []
rs.on('data', (chunk) => {
  bufferArr.push(chunk)
})

rs.on('end', () => {
  // 如果是buffer，我们需要通过concat拼接
  console.log(Buffer.concat(bufferArr).toString())
  // 注意from传入的参数是一个数组，而不是buffer数组。
  // console.log(bufferArr, Buffer.from(bufferArr).toString())
  console.log('当数据被清空之后')
})

rs.on('error', (err) => {
  console.log('出错了')
})
```
### 文件可写流
写入数据只能写入buffer和字符串。
```js
const fs = require('fs')

const ws = fs.createWriteStream('test.txt', {
  flags: 'w', 
  mode: 438,
  fd: null,
  encoding: "utf-8",
  // 从文件哪个位置开始写入
  start: 0,
  // 默认是16kb
  highWaterMark: 3
})

// 写入表示一次文件的打开和关闭。而不是调用write为一次。

// 字符串 或者  buffer -> fs rs
let buf = Buffer.from('abc')
ws.write(buf, () => {
  console.log('ok1')
}) 

// 多次写入
ws.write('中国', () => {
  console.log('ok2')
}) 

// createWriteStream 调用时触发
ws.on('open', (fd) => {
  console.log('open', fd)
}) 


// close 是在数据写入操作全部完成之后再执行。
// 只有手动调用end方法才会触发
ws.on('close', () => {
  console.log('文件关闭了')
}) 

// end 执行之后就意味着数据写入操作完成
ws.end('结束')


// error 并不能捕获语法错误。
ws.on('error', (err) => {
  console.log('出错了')
})
```
### write的执行流程
```js
const fs = require("fs")


const ws = fs.createWriteStream("test.txt", {
  highWaterMark: 3
})


ws.write("1234")
// ws.write("2")
// ws.write("3")

ws.on("drain", () => {
  // 当写入的字节数大于等于highWaterMark时触发
  console.log("drain触发")
})
```
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afab7682ff9e473bbb5befec3c7b4479~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/539940472fd04fe5a7a28451a2b66e6c~tplv-k3u1fbpfcp-watermark.image?)
### 通过drain事件来限制写入速度
```js
/**
 * 需求：“中国牛逼” 写入指定的文件
 * 01 一次性写入
 * 02 分批写入
 */
let fs = require('fs')

let ws = fs.createWriteStream('test.txt', {
  highWaterMark: 3
})

// 对于大量数据，他会造成内存溢出。
// 如果生产者生产的数据大于消费者消费的数据，那么多余的数据将放在缓冲区中
// ws.write('中国牛逼')

let source = "中国牛逼".split('')
let num = 0
let flag = true

function executeWrite () {
  flag = true
  while(num !== 4 && flag) {
    flag = ws.write(source[num])
    num++
  }
}

executeWrite()

ws.on('drain', () => {
  console.log('drain 执行了')
  // 控制继续写入
  executeWrite()
})
```
### 背压机制
就是实现nodejs平滑写入内容。

nodejs的stream实现了背压机制。如果没有背压机制读写数据可能会出现问题。**当生产者的生产的数据量大于消费者消费的数据量，就会将多余的数据放在缓冲区中，但是缓冲区也有大小限制，可能会造成内存泄漏，GC频繁调用，其他进程变慢等。**

```js
let fs = require('fs')

let rs = fs.createReadStream('test.txt', {
  highWaterMark: 4
})

let ws = fs.createWriteStream('test1.txt', {
  highWaterMark: 1
})

let flag = true

rs.on('data', (chunk) => {
  flag = ws.write(chunk, () => {
    console.log('写完了')
  })
  if (!flag) {
    rs.pause()
  }
})

// 当drain触发时，表示数据可以继续写入
ws.on('drain', () => {
  rs.resume()
}) 

// pipe做的事情就是上面那些代码做的事情
// rs.pipe(ws)
```
### 手写文件可读流
##  通信
### 通信必要条件
- 主机之间需要有传输介质（网线，光纤等，建立物理连接）
- 主机上必须有网卡设备（信号的调制与解调制，数字信号和电信号的转换）
- 主机之间需要协商网络速率。

### 网络通讯方式
- 交换机通讯，局域网中的主机通过交换机来进行通信。**局域网存在大量主机会造成广播风暴。**
- 路由器通讯，不同局域网之间的主机进行通讯，需要通过ip地址查找到对应的局域网段。 

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/741e3982c43948ec9cf8f9cb42ba1978~tplv-k3u1fbpfcp-watermark.image?)

### OSI 七层模型

- 应用层：用户与网络的接口

- 表示层：数据加密、转换、压缩

- 会话层：控制网络连接建立与终止

- 传输层：控制数据传输可靠性

- 网络层：确定目标网络

- 数据链路层：确定目标主机

- 物理层：各种物理设备和标准


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5da7aff7a498400d9f986d0fa4044485~tplv-k3u1fbpfcp-watermark.image?)

[具体内容可以看这里](https://zhuanlan.zhihu.com/p/334668650)
### TCP通信

#### 粘包
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1def8f3334da4d2a948b1e296029cbf1~tplv-k3u1fbpfcp-watermark.image?)
通过延时发送或者封包解包来解决粘包问题。
```js
// server.js
const net = require('net')

// 创建服务端实例
const server = net.createServer()

const PORT = 1234
const HOST = 'localhost'

server.listen(PORT, HOST)

server.on('listening', () => {
  console.log(`服务端已经开启在 ${HOST}: ${PORT}`)
})

// 接收消息 回写消息
server.on('connection', (socket) => {
  socket.on('data', (chunk) => {
    const msg = chunk.toString()
    console.log(msg)

    // 回数据
    socket.write(Buffer.from('您好' + msg))
  })
})

server.on('close', () => {
  console.log('服务端关闭了')
})

server.on('error', (err) => {
  if (err.code == 'EADDRINUSE') {
    console.log('地址正在被使用')
  }else{
    console.log(err)
  }
})
```
```js
// client.js
// 基于流的tcp通信

const net = require('net')

// 连接服务端
const client = net.createConnection({
  port: 1234, 
  host: '127.0.0.1'
})

// sleep
async function sleep() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000);
  })
}

client.on('connect', async () => {
  client.write('昊淼您好')
  // 出现连包
  // client.write('昊淼您好2')
  // client.write('昊淼您好3')
  // client.write('昊淼您好4')
  /**
   * 解决方案
   * 1. 延时发送
   */
  await sleep()
  client.write('昊淼您好2')
  await sleep()
  client.write('昊淼您好3')
  await sleep()
  client.write('昊淼您好4')
})

client.on('data', (chunk) => {
  console.log(chunk.toString())
})

client.on('error', (err) => {
  console.log(err)
})

client.on('close', () => {
  console.log('客户端断开连接')
})
```
#### 封包和解包
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9142bcbb3224d6382970a33b0f7e2fc~tplv-k3u1fbpfcp-watermark.image?)

数据传输过程
- 进行数据编码，获取二进制数据包
- 按照规则拆解数据，获取指定长度的数据。

读取数据
- writeInt16BE 将value从指定位置写入
- redInt16BE 从指定位置开始读取数据

```js
class MyTransformCode{
  constructor() {
    // header总长度
    this.packageHeaderLen = 4
    // 包编号
    this.serialNum = 0
    // 消息体的长度
    this.serialLen = 2
  }

  // 编码
  encode(data, serialNum) {
    // 将数据转为二进制
    const body = Buffer.from(data)

    // 01 先按照指定的长度来申请一片内存空间做为 header 来使用
    const headerBuf = Buffer.alloc(this.packageHeaderLen)

    // 02 将数据写入buffer
    headerBuf.writeInt16BE(serialNum || this.serialNum)
    // 写入消息的长度
    headerBuf.writeInt16BE(body.length, this.serialLen)

    if (serialNum == undefined) {
      this.serialNum++
    }

    return Buffer.concat([headerBuf, body])
  }

  // 解码
  decode(buffer) {
    // 取出消息头（消息长度和消息编号）
    const headerBuf = buffer.slice(0, this.packageHeaderLen)
    // 取出消息体
    const bodyBuf = buffer.slice(this.packageHeaderLen)

    return {
      // 消息编号
      serialNum: headerBuf.readInt16BE(),
      // 消息体长度
      bodyLength: headerBuf.readInt16BE(this.serialLen), // 可以指定从哪个位置开始读取
      body: bodyBuf.toString()
    }
  }

  // 获取包长度的方法
  getPackageLen(buffer) {
    if (buffer.length < this.packageHeaderLen) {
      return 0
    } else {
      return this.packageHeaderLen + buffer.readInt16BE(this.serialLen)
    }
  }
}

module.exports = MyTransformCode
```
## node充当静态web服务器
[node充当静态web服务器](https://github.com/zhang-glitch/nodejs_demo.git/hmserve)