
// // 在模块化调用中，this被赋值为{}
// console.log(this == global); // false


// (function () {
//   console.log(this == global) // true
// })()


// // 事件操作
// process.on("exit", function() {
//   console.log("exit...")
// })

// process.on("beforeExit", function() {
//   console.log("before exit...")
// })

// // 主动退出
// process.exit() // 手动退出并不会触发beforeExit


// 流操作

// process.stdout 标准输出
// process.stdin 标准输入


// process.stdin.pipe(process.stdout)


process.stdin.setEncoding("utf-8")
process.stdin.on("readable", () => {
  let chunk = process.stdin.read() // 从输入中取出数据
  if(!chunk) {
    process.stdout.write("输出" + chunk)
  }
})