const path = require("path")
const fs = require("fs")

function copy(srcPath, destPath) {
  const buf = Buffer.alloc(10)
  let readOffset = 0;
  fs.open(path.resolve(__dirname, srcPath),"r", (err, rfd) => {
    fs.open(path.resolve(__dirname, destPath), "w", (err2, wfd) => {
      if(!err) {
        function next() {
          // 从文件的0位置开始读取，读取10个字节，从buf的0位置开始放
          fs.read(rfd, buf, 0, buf.length, readOffset, (err3, readBytes, data) => {
            if(readBytes === 0) { // 读取为0时
              fs.close(rfd, ()=> {})
              fs.close(wfd, ()=> {})
              console.log("拷贝成功")
              return
            }
            // 从文件0位置开始写入，写入readBytes字节，从buf的0位置开始读
            fs.write(wfd, buf, 0, readBytes, readOffset, (err4, written, buffer) => {
              if(!err4) {
                readOffset += readBytes
                // 当写入完毕，再次读取
                next()
              }
            })
          })
        }
        next()
      }else {
        console.log("err", err)
      }
    })
  })

}

copy("a.txt", "b.txt")