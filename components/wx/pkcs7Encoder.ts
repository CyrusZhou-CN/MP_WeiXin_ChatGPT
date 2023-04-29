import * as crypto from "crypto";
import writeToFile from "../log";
const blocksize = 32;
/**
 * PKCS7Encoder class
 *
 * 提供基于 PKCS7 算法的加解密接口.
 */
export class PKCS7Encoder {

/**
对需要加密的明文进行填充补位
@param string text 需要进行填充补位的明文
@return string 补齐明文字符串
*/
  encode(data: Buffer): Buffer {
    const textlength = data.length;
    //计算需要填充的位数
    let amountToPad = blocksize - (textlength % blocksize);
    if (amountToPad === 0) {
      amountToPad = blocksize;
    }
    const pad_string: Buffer = Buffer.alloc(amountToPad, amountToPad);
    const dataBuffer: Buffer = Buffer.concat([data, pad_string]);
    return dataBuffer;
  }
  /**  
  对解密后的明文进行补位删除
  @param string text 解密后的明文
  @return string 删除补位后的明文
  */
  decode(data: Buffer): Buffer {
    let pad = data[data.length - 1];
    if (pad < 1 || pad > blocksize) {
      pad =0;
    }
    return  data.slice(0, data.length - pad);
  }
}