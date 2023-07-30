#! /usr/bin/env node

const {program} = require('commander')

// console.log('执行了')
// program.option('-p --port', 'set server port')

// 配置信息
let options = {
  '-p --port <dir>': {
    'description': 'init server port',
    'example': 'hmserve -p 8888'
  },
  '-d --directory <dir>': {
    'description': 'init server directory',
    'example': 'hmserve -d c:'
  }
}

function formatConfig (configs, cb) {
  Object.entries(configs).forEach(([key, val]) => {
    cb(key, val)
  })
}

formatConfig(options, (cmd, val) => {
  // 配置options
  program.option(cmd, val.description)
})

// 增加-h 时的详细信息
program.on('--help', () => {
  console.log('Examples: ')
  formatConfig(options, (cmd, val) => {
    console.log(val.example)
  })
})

program.name('hmserve')
let version = require('../package.json').version
program.version(version)

// 解析参数, 返回参数配置对象
let cmdConfig = program.parse(process.argv)
// console.log(cmdConfig) // 这里包含解析的参数对象

let Server = require('../main.js')
new Server(cmdConfig).start()
