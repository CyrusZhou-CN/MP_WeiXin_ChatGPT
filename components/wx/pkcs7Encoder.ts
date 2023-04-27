
/**
 * PKCS7Encoder class
 *
 * 提供基于 PKCS7 算法的加解密接口.
 */
export class PKCS7Encoder {
  public static block_size = 32;

  /**
   * 对需要加密的明文进行填充补位
   * @param text 需要进行填充补位操作的明文
   * @returns 补齐明文字符串
   */
  public encode(text: string): string {
    const block_size = PKCS7Encoder.block_size;
    const text_length = text.length;
    // 计算需要填充的位数
    let amount_to_pad = PKCS7Encoder.block_size - (text_length % PKCS7Encoder.block_size);
    if (amount_to_pad === 0) {
      amount_to_pad = PKCS7Encoder.block_size;
    }
    // 获得补位所用的字符
    const pad_chr = String.fromCharCode(amount_to_pad);
    let tmp = "";
    for (let index = 0; index < amount_to_pad; index++) {
      tmp += pad_chr;
    }
    return text + tmp;
  }

  /**
   * 对解密后的明文进行补位删除
   * @param decrypted 解密后的明文
   * @returns 删除填充补位后的明文
   */
  public decode(text: string): string {
    let pad = text.charCodeAt(text.length - 1);
    if (pad < 1 || pad > 32) {
      pad = 0;
    }
    return text.slice(0, text.length - pad);
  }
}
