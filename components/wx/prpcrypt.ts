
import { createCipheriv, createDecipheriv } from "crypto";
import { ErrorCode, getErrorMsg } from "./errorCode";
import { PKCS7Encoder } from "./pkcs7Encoder";
import writeToFile from "../log";
const fs = require('fs');
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
        // 获得 16 位随机字符串，填充到明文之前
        const random = this.getRandomStr();
        text = random + text + appid;
        // 网络字节序
        const size = 16;
        const iv = this.key.slice(0, 16);
        // 使用自定义的填充方式对明文进行补位填充
        const pkc_encoder = new PKCS7Encoder();
        const encodedText = pkc_encoder.encode(text);
        const cipher = createCipheriv("AES-256-CBC", this.key, iv);
        // 加密
        let encrypted = cipher.update(encodedText, "utf8", "base64");
        encrypted += cipher.final("base64");
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
        // 使用 BASE64 对需要解密的字符串进行解码
        const iv = this.key.slice(0, 16);
        const cipher = createDecipheriv("AES-256-CBC", this.key, iv);
        cipher.setAutoPadding(false);
        let decipher = cipher.update(encrypted, 'base64', 'utf8');
        decipher += cipher.final('utf8');
        // 去除补位字符        
        const pkc_encoder = new PKCS7Encoder();
        const result = pkc_encoder.decode(decipher);
        // 去除 16 位随机字符串，网络字节序和 AppId
        if (result.length < 16) {
          return [ErrorCode.IllegalBuffer, getErrorMsg(ErrorCode.IllegalBuffer)];
        }        
        const content = result.replace(/[\x00\x01\x1b\x7f\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '').slice(16);
        const xml_len = content.length;
        const from_appid = content.substring(xml_len - appid.length)
        const xmlContent = content.slice(0,xml_len - appid.length);
        // 将字符串写入文件中       
        writeToFile('content', content);
        if (from_appid !== appid) {
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