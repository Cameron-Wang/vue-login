/* 产引入jsencrypt实现数据RSA加密 */
import JSEncrypt from 'jsencrypt' // 处理长文本数据时报错 jsencrypt.js Message too long for RSA
/* 产引入encryptlong实现数据RSA加密 */
import Encrypt from 'encryptlong' // encryptlong是基于jsencrypt扩展的长文本分段加解密功能。

import { getToken } from '@/utils/auth'
// 密钥对生成 http://web.chacuo.net/netrsakeypair

// 公钥key
const publicKey = getToken()
// 私钥key
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDfAciWTiAK41cwb7Lu8mntGUlN7D60FeZWHRH86JVJxu0mKqLe
BunlT8JXyH7Zcues2tp7V8yhx/5RKdecxEm0/XV0IrJjV7OCsZEyjoGMkgm0vgJE
DtblW/Sii4Ws634uhOgGb+1GSgjxKZNyjfzaiq4D14pWfVM2W5y/ovHksQIDAQAB
AoGBANp+sdxqUUS5t8xyNFufUZ+HfeYGCO2C43oN43jrHJH7gJE7hvWIypPtUJmX
jIla5pjamOPug0UjYQ5+s40aWKdSoH6KksZNMMz5tcGXZG/VrRUrEMY4DdVL2XNQ
nf/PwpQlXW0CkU7FwljIc1X1dj8oR2grdtOq/xNHR/b9p1NtAkEA9h4N3YVwvAIb
1oZFIUP+ixwz/8rtTjVeBzMqZCKuM8aEbZtpCqhU7WPw/lkavel11ZMfTjf1FYSn
Sg+Ic20xLwJBAOf2KtmPpI7BViokmgJXPLoFiUpOeTUieV/WEqDYUozbcFh6ZPc0
91R3jmqsm9FBSqWylTPV7SAk57Pyfx86EB8CQQCLIy5/f4LeJusJ+lp2lfP/PPCA
uX4y6qS/uUNL3PdSufX/6Q4XQlbQ5eFGSaV+m89L8KKQG75obdgNXH6tkpttAkBZ
2s8Qhgc90YD6REFwhLCecsSTB0EGpzsTN87xhbq8m8iyTX9ND7R7gPCnPAQEFGHB
PCN19/mqSQGEgHxj8U8LAkBwCeuBJHKlb2rFpbSj5sEKTmDeD9gx3xkEKwMpO6d5
ZPa2FeAjMONtVtps1gMB3oRx+dMu9CSTvpap5JwWw41U
-----END RSA PRIVATE KEY-----`

export default {
  /* JSEncrypt加密 */
  rsaPublicData(data) {
    var jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(publicKey)
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = jsencrypt.encrypt(data)
    return result
  },
  /* JSEncrypt解密 */
  rsaPrivateData(data) {
    var jsencrypt = new JSEncrypt()
    jsencrypt.setPrivateKey(privateKey)
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = jsencrypt.encrypt(data)
    return result
  },
  /* 加密 */
  encrypt(data) {
    const PUBLIC_KEY = publicKey
    var encryptor = new Encrypt()
    encryptor.setPublicKey(PUBLIC_KEY)
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    const result = encryptor.encryptLong(data)
    return result
  },
  /* 解密 - PRIVATE_KEY - 验证 */
  decrypt(data) {
    const PRIVATE_KEY = privateKey
    var encryptor = new Encrypt()
    encryptor.setPrivateKey(PRIVATE_KEY)
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = encryptor.decryptLong(data)
    return result
  }
}
