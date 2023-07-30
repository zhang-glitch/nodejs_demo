const fs = require("fs")

/**
 * 先查找pathname是否存在，不存在抛出错误，存在就直接删除该文件或者该文件夹下的内容
 */
function rmdir(pathname, cb) {
  fs.access(pathname, (err) => {
    if(err) {
      cb && cb()
    }else {
      // 递归直接删除该文件夹下的所有文件
      function next(pathname) {
        fs.stat(pathname, (err, obj) => {
          console.log(obj)
          if(obj.isFile()) {
            fs.unlink(pathname)
          }else {
            // 读取改文件夹下的所有内容进行删除
            fs.readdir(pathname, (err, files) => {
              for(let item of files) {
                next(pathname+item)
              }
            })
          }
        })
      }

      next(pathname)
    }
  })
}

rmdir("a/b")