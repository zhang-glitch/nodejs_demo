const fs = require("fs")

function mkdir(pathname, cb) {
  const paths = pathname.split("/")
  let index = 1;
  function next() {
    // 当路径遍历完，将结束循环
    if(index > paths.length) return cb && cb()
    // 每一次加上前一次的路径判断是否存在
    let path = paths.slice(0, index++).join("/")
    fs.access(path, (err) => {
      if(!err) {
        next()
      }else {
        console.log("err", err)
        // 不存在就创建
        fs.mkdir(path, next)
      }
    })
  }
  next()
}

mkdir("a/b/c/d/e", () => {
  console.log("创建成功")
})