
import { createCipheriv, createDecipheriv } from "crypto";
import { ErrorCode, getErrorMsg } from "./errorCode";
import { PKCS7Encoder } from "./pkcs7Encoder";
import writeToFile from "../log";
import { Buffer } from 'buffer';
/**
 * Prpcrypt class
 *
 * 提供接收和推送给公众平台消息的加解密接口.
 */
export class Prpcrypt {
    public key: Buffer;
  
    constructor(k: string) {
      this.key = Buffer.from(k + "=", "base64");
    }
  
    /**
     * 对明文进行加密
     * @param text 需要加密的明文
     * @param appid 
     * @returns 加密后的密文
     */
    public encrypt(text: string, appid: string): [number, string] {
      try {
        appid = appid.trim();
        const lenBuffer = Buffer.alloc(4, 0); // 创建一个长度为 4 的空的 Buffer
        lenBuffer.writeInt32BE(text.length); // 将字符串的长度转成网络字节序写入 Buffer
        const random = Buffer.from(this.getRandomStr());
        const appidBuffer = Buffer.from(appid);
        let textBuffer = Buffer.from(text);
        textBuffer = Buffer.concat([random, lenBuffer, textBuffer, appidBuffer]);
        // 网络字节序
        const iv = this.key.slice(0, 16);
        // 使用自定义的填充方式对明文进行补位填充
        const pkc_encoder = new PKCS7Encoder();
        const encodedBuffer = pkc_encoder.encode(textBuffer)
        const cipher = createCipheriv("AES-256-CBC", this.key, iv);
        cipher.setAutoPadding(false);
        // 加密
        const encrypted = Buffer.concat([cipher.update(encodedBuffer), cipher.final()]).toString('base64');
        // 使用 BASE64 对加密后的字符串进行编码
        return [ErrorCode.OK, encrypted];
      } catch (e) {
        // console.log(e);
        writeToFile('error', e);
        return [ErrorCode.EncryptAESError, getErrorMsg(ErrorCode.EncryptAESError)];
      }
    }
  
    /**
     * 对密文进行解密
     * @param encrypted 需要解密的密文
     * @param appid 
     * @returns 解密得到的明文
     */
    public decrypt(encrypted: string, appid: string): [number, string] {
      try {
        appid = appid.trim();
        // 使用 BASE64 对需要解密的字符串进行解码
        const iv = this.key.slice(0, 16);
        const decipher = createDecipheriv("AES-256-CBC", this.key, iv);
        decipher.setAutoPadding(false);
        const decryptedBuffer = Buffer.concat([decipher.update(encrypted,'base64'), decipher.final()]);
        // 去除补位字符
        const pkc_encoder = new PKCS7Encoder();
        const resultBuffer = pkc_encoder.decode(decryptedBuffer);
        // 去除 16 位随机字符串，网络字节序和 AppId
        if (resultBuffer.length < 16) {
          return [ErrorCode.IllegalBuffer, getErrorMsg(ErrorCode.IllegalBuffer)];
        }
        let content = resultBuffer.slice(16+4).toString(); // 去除16位随机数+4位网络字节序
        writeToFile('content:', content);
        const from_appid = content.substring(content.length-appid.length, content.length);
        const xmlContent = content.substring(0, content.length-appid.length);
        writeToFile('xmlContent:', xmlContent);
        if (from_appid !== appid) {
          console.log(`from_appid, appid: ${from_appid}, ${appid}`);
          return [ErrorCode.ValidateAppidError, getErrorMsg(ErrorCode.ValidateAppidError)];
        }
        return [ErrorCode.OK, xmlContent];
      } catch (e) {
        //console.log(e);
        writeToFile('error', e);
        return [ErrorCode.DecryptAESError, getErrorMsg(ErrorCode.DecryptAESError)];
      }
    }
  
    /**
     * 随机生成 16 位字符串
     * @returns 生成的字符串
     */
    private getRandomStr(): string {
      const str_pol = "234567acdefhijkmnprstACDEFGHJKMNPQRSUVWXYZ";
      const max = str_pol.length - 1;
      let str = "";
      for (let i = 0; i < 16; i++) {
        str += str_pol.charAt(Math.floor(Math.random() * max));
      }
      return str;
    }
  }