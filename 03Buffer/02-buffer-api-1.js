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
// let b1 = Buffer.alloc(6)
// let b2 = Buffer.from('123456')

// b2.copy(b1, 3, 3, 5)
// console.log(b1.toString()) // 45
// console.log(b2.toString()) // 123456


/**
 * 可以指定拼接的长度
 */
const b1 = Buffer.from([1,2,3])
const b2 = Buffer.from([3,4,5])
console.log(Buffer.concat([b1, b2], 2)) // <Buffer 01 02>


console.log(Buffer.isBuffer(b1))