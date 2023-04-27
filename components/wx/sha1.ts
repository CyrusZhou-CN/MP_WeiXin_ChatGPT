import writeToFile from '../log';
import {ErrorCode, getErrorMsg} from './errorCode';
import sha1 from 'sha1';
/**
 * SHA1 class
 *
 * 计算公众平台的消息签名接口.
 */
export default class SHA1 {
  /**
   * 用SHA1算法生成安全签名
   * @param token 票据
   * @param timestamp 时间戳
   * @param nonce 随机字符串
   * @param encrypt_msg 密文消息
   * @returns [ErrorCode: number,SHA1 string | null]如果计算成功，返回安全签名，否则返回错误码。
   */
  public getSHA1(token: string, timestamp: string, nonce: string, encrypt_msg: string): [number, string | null] {
    try {
      const array: string[] = [token, timestamp, nonce];
      array.sort();
      const str: string = array.join('');
      return [ErrorCode.OK, sha1(str)];
    } catch (e) {
      writeToFile('error', e);
      return [ErrorCode.ComputeSignatureError, getErrorMsg(ErrorCode.ComputeSignatureError)];
    }
  }  
}