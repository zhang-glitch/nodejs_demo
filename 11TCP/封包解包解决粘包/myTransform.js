class MyTransformCode{
  constructor() {
    // header总长度
    this.packageHeaderLen = 4
    // 包编号
    this.serialNum = 0
    // 消息体的长度
    this.serialLen = 2
  }

  // 编码
  encode(data, serialNum) {
    // 将数据转为二进制
    const body = Buffer.from(data)

    // 01 先按照指定的长度来申请一片内存空间做为 header 来使用
    const headerBuf = Buffer.alloc(this.packageHeaderLen)

    // 02 将数据写入buffer
    headerBuf.writeInt16BE(serialNum || this.serialNum)
    // 写入消息的长度
    headerBuf.writeInt16BE(body.length, this.serialLen)

    if (serialNum == undefined) {
      this.serialNum++
    }

    return Buffer.concat([headerBuf, body])
  }

  // 解码
  decode(buffer) {
    // 取出消息头（消息长度和消息编号）
    const headerBuf = buffer.slice(0, this.packageHeaderLen)
    // 取出消息体
    const bodyBuf = buffer.slice(this.packageHeaderLen)

    return {
      // 消息编号
      serialNum: headerBuf.readInt16BE(),
      // 消息体长度
      bodyLength: headerBuf.readInt16BE(this.serialLen), // 可以指定从哪个位置开始读取
      body: bodyBuf.toString()
    }
  }

  // 获取包长度的方法
  getPackageLen(buffer) {
    if (buffer.length < this.packageHeaderLen) {
      return 0
    } else {
      return this.packageHeaderLen + buffer.readInt16BE(this.serialLen)
    }
  }
}

module.exports = MyTransformCode