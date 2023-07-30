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
