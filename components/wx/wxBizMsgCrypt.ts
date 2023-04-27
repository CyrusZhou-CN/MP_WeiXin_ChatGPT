import {Prpcrypt} from "./prpcrypt";
import SHA1 from "./sha1";
import XMLParse from "./xmlparse";
import {ErrorCode, getErrorMsg} from "./errorCode";
import writeToFile from "../log";

/**
 * 1.第三方回复加密消息给公众平台；
 * 2.第三方收到公众平台发送的消息，验证消息的安全性，并对消息进行解密。
 */
export class WXBizMsgCrypt {
  private token: string;
  private encodingAesKey: string;
  private appId: string;

  /**
   * 构造函数
   * @param token 公众平台上，开发者设置的token
   * @param encodingAesKey 公众平台上，开发者设置的EncodingAESKey
   * @param appId 公众平台的appId
   */
  constructor(token: string, encodingAesKey: string, appId: string) {
    this.token = token;
    this.encodingAesKey = encodingAesKey;
    this.appId = appId;
  }

  /**
   * 将公众平台回复用户的消息加密打包.
   * <ol>
   *    <li>对要发送的消息进行AES-CBC加密</li>
   *    <li>生成安全签名</li>
   *    <li>将消息密文和安全签名打包成xml格式</li>
   * </ol>
   *
   * @param replyMsg 公众平台待回复用户的消息，xml格式的字符串
   * @param timeStamp 时间戳，可以自己生成，也可以用URL参数的timestamp
   * @param nonce 随机串，可以自己生成，也可以用URL参数的nonce
   * @param encryptMsg 加密后的可以直接回复用户的密文，包括msg_signature, timestamp, nonce, encrypt的xml格式的字符串,
   *                      当return返回0时有效
   *
   * @return [number, string] 成功0，失败返回对应的错误码
   */
  public encryptMsg(replyMsg: string, timeStamp: string | null, nonce: string): [number, string] {
    const pc = new Prpcrypt(this.encodingAesKey);

    //加密
    const [ret,encrypt] = pc.encrypt(replyMsg, this.appId);    
    if (ret !== 0) {
      return [ret,getErrorMsg(ret)];
    }

    if (timeStamp == null) {
      timeStamp = new Date().getTime().toString();
    }

    //生成安全签名
    const sha1 = new SHA1();
    const [errCode,signature] = sha1.getSHA1(this.token, timeStamp, nonce, encrypt);
    if (errCode !== 0) {
      return [errCode,getErrorMsg(errCode)];
    }
    const signatureStr = signature as string;

    //生成发送的xml
    const xmlparse = new XMLParse();
    const encryptMsg = xmlparse.generate(encrypt, signatureStr, timeStamp, nonce);
    return [ErrorCode.OK,encryptMsg];
  }


  /**
   * 检验消息的真实性，并且获取解密后的明文.
   * <ol>
   *    <li>利用收到的密文生成安全签名，进行签名验证</li>
   *    <li>若验证通过，则提取xml中的加密消息</li>
   *    <li>对消息进行解密</li>
   * </ol>
   *
   * @param msgSignature 签名串，对应URL参数的msg_signature
   * @param timestamp 时间戳 对应URL参数的timestamp
   * @param nonce 随机串，对应URL参数的nonce
   * @param postData 密文，对应POST请求的数据
   *
   * @return [number, string] 成功0，失败返回对应的错误码
   */
  public decryptMsg(msgSignature: string, timestamp: string | null, nonce: string, postData: string): [number, string] {
    if (this.encodingAesKey.length !== 43) {
      return [ErrorCode.IllegalAesKey,''];
    }

    const pc = new Prpcrypt(this.encodingAesKey);

    //提取密文
    const xmlparse = new XMLParse();
    const [ret,encrypt,touser_name] = xmlparse.extract(postData);

    if (ret !== 0) {
      return [ret,getErrorMsg(ret)];
    }

    if (timestamp == null) {
      timestamp = new Date().getTime().toString();
    }

    const encryptStr = encrypt as string;
    //验证安全签名
    const sha1 = new SHA1();
    const [ret1,signature] = sha1.getSHA1(this.token, timestamp, nonce, encryptStr);
    if (ret1 !== 0) {
      return [ret1,getErrorMsg(ret1)];
    }

    if (signature !== msgSignature) {
      //console.log(`signature !== msgSignature:${signature} !== ${msgSignature}`);
      writeToFile("log", `signature !== msgSignature:${signature} !== ${msgSignature}`);
      return [ErrorCode.ValidateSignatureError,getErrorMsg(ErrorCode.ValidateSignatureError)];
    }
    const [result,msg] = pc.decrypt(encryptStr, this.appId);
    if (result !== 0) {
      return [result,getErrorMsg(result)];
    }
    return [ErrorCode.OK,msg];
  }
  public parseFromString(body: any):[number,any] {
    const xmlparse = new XMLParse();
    return xmlparse.parse(body);
  }
}

export default WXBizMsgCrypt;
