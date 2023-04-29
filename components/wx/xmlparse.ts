import writeToFile from "../log";
import {ErrorCode} from "./errorCode";
import { DOMParser } from 'xmldom'

/**
 * XMLParse class
 *
 * 提供提取消息格式中的密文及生成回复消息格式的接口.
 */
export default class XMLParse {
  /**
   * 提取出xml数据包中的加密消息
   * @param xmltext 待提取的xml字符串
   * @returns [ErrorCode:number, encrypt:string | null,tousername: string | null]提取出的加密消息字符串
   */
  public extract(xmltext: string): [number, string | null, string | null] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmltext, "text/xml");
      const encrypt = xmlDoc.getElementsByTagName('Encrypt')[0]?.textContent || '';
      const tousername =xmlDoc.getElementsByTagName('ToUserName')[0]?.textContent || '';
      
      return [ErrorCode.OK, encrypt, tousername];
    } catch (error) {
      // console.log(error);
      writeToFile('error', error);
      return [ErrorCode.ParseXmlError, null, null];
    }
  }

  public parse(xmltext: string): [number, any] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmltext, "text/xml");
      const xml= {
        encrypt : xmlDoc.getElementsByTagName('Encrypt')[0]?.textContent || '',
        tousername :xmlDoc.getElementsByTagName('ToUserName')[0]?.textContent || '',
        fromusername :xmlDoc.getElementsByTagName('FromUserName')[0]?.textContent || '',
        msgtype :xmlDoc.getElementsByTagName('MsgType')[0]?.textContent || '',
        content :xmlDoc.getElementsByTagName('Content')[0]?.textContent || '',
        msgid :xmlDoc.getElementsByTagName('MsgId')[0]?.textContent || '',
        createtime : Number.parseInt(xmlDoc.getElementsByTagName('CreateTime')[0]?.textContent || '0'),
        event :xmlDoc.getElementsByTagName('Event')[0]?.textContent || '',
        eventkey :xmlDoc.getElementsByTagName('EventKey')[0]?.textContent || '',
      }
      return [ErrorCode.OK,xml];
    } catch (error) {
      // console.log(error);
      writeToFile('error', error);
      return [ErrorCode.ParseXmlError, null];
    }
  }

  /**
   * 生成xml消息
   * @param encrypt 加密后的消息密文
   * @param signature 安全签名
   * @param timestamp 时间戳
   * @param nonce 随机字符串
   * @returns xml格式的加密消息
   */
  public generate(encrypt: string, signature: string, timestamp: string, nonce: string): string {
    const format = `<xml>
<Encrypt><![CDATA[${encrypt}]]></Encrypt>
<MsgSignature><![CDATA[${signature}]]></MsgSignature>
<TimeStamp>${timestamp}</TimeStamp>
<Nonce><![CDATA[${nonce}]]></Nonce>
</xml>`;
    return format;
  }
}
