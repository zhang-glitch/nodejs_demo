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