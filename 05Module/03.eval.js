
const fs = require("fs")
const vm = require("vm")

const b = 100
 a = 100
const content = fs.readFileSync("./demo.js", "utf-8") // var  a = 10

// eval(content)

// console.log("a", a) // 10


// const fn = new Function("", `${content} return a`);

// console.log(fn()) // 10

// vm.runInThisContext(content) // 内部是一个沙箱，不能使用外部变量。但是外部可以使用沙箱内的内容
// console.log(a) // 10

const res = vm.runInThisContext("a = a + 10") // 但是沙箱内可以使用外部为使用声明定义的变量
console.log(a) // 110

console.log(vm.runInThisContext("(function foo() { return 1})"))
