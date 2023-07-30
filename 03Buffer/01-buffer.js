// const b1 = Buffer.alloc(10)
// // 创建的内存可能会有数据，该内存没有对象指向就可以被拿来创建内存，但是可能会有数据存在。
// const b2 = Buffer.allocUnsafe(10)

// console.log(b1)
// console.log(b2) 

// from 
/**
 * 字符串
 * 数组
 * buffer对象
 */
// const b1 = Buffer.from('1')
// console.log(b1) // <Buffer 31>

// const b1 = Buffer.from('张')
// console.log(b1) // <Buffer e5 bc a0>

// const b1 = Buffer.from([0xe4, 0xb8, 0xad])
// const b1 = Buffer.from([0x60, 0b1001, 12]) // 60 09 0c 
// const b1 = Buffer.from(["张", 1], "utf") // 直接传入汉字不能识别，需要转成进制才可以传入
// console.log(b1)  // <Buffer 00 01>
// console.log(b1.toString()) 

// const b1 = Buffer.alloc(3)
// const b2 = Buffer.from(b1) // 重新拷贝一份，修改b1不会影响b2

// // console.log(b1) // <Buffer 00 00 00>
// // console.log(b2)

// b1[0] = 1
// console.log(b1) // <Buffer 01 00 00>
// console.log(b2) // <Buffer 00 00 00>