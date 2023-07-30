const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const {createReadStream} = require('fs')
const mime = require('mime')
const ejs = require('ejs')
const {promisify} = require('util')

function mergeConfig (config) {
  return{
    port: 8888, 
    directory: process.cwd(),
    ...config
  }
}

class Server{
  constructor(config) {
    this.config = mergeConfig(config)
    // console.log(this.config)
  }
  start() {
    let server = http.createServer(this.serveHandle.bind(this))
    server.listen(this.config.port, () => {
      console.log('服务端已经启动了.......')
    })
  }
  // 处理请求回调
  async serveHandle(req, res) {
    let {pathname} = url.parse(req.url)
    pathname = decodeURIComponent(pathname)
    let abspath = path.join(this.config.directory, pathname)
    // console.log(abspath)
    try {
      let statObj = await fs.stat(abspath)
      if (statObj.isFile()) { // 文件
        this.fileHandle(req, res, abspath)
      } else { // 文件夹，需要将目录 / 文件渲染到页面上
        let dirs = await fs.readdir(abspath) // 返回当前路径下的目录和文件名
        dirs = dirs.map((item) => {
          return {
            path: path.join(pathname, item),
            dirs: item
          }
        })
        // console.log(dirs)
        // 将ejs操作改造成返回promise对象
        let renderFile = promisify(ejs.renderFile)

        // 获取路径所在的文件夹
        let parentpath = path.dirname(pathname)

        // 将文件列表渲染到模板中
        let ret = await renderFile(path.resolve(__dirname, 'template.html'), {
          arr: dirs,
          parent: pathname == '/' ? false : true,
          parentpath: parentpath,
          title: path.basename(abspath)
        })
        res.end(ret)
      }
    } catch (err) {
      this.errorHandle(req, res, err)
    }
  }
  errorHandle(req, res, err) {
    console.log(err)
    res.statusCode = 404
    res.setHeader('Content-type', 'text/html;charset=utf-8')
    res.end('Not Found')
  }
  fileHandle(req, res, abspath) {
    res.statusCode = 200
    res.setHeader('Content-type', mime.getType(abspath) + ';charset=utf-8')
    createReadStream(abspath).pipe(res)
  }
}

module.exports = Server