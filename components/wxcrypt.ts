import sysconfig from "./sysconfig";
import sha1 from 'sha1';
import { Base64 } from 'js-base64';
import * as crypto from 'crypto';

interface CryptOptions {
  appId: string;
  token: string;
  encodingAESKey: string;
}
export class Pkcs7Encoder {
  encode(content: string | Buffer): Buffer {
    let buffer: Buffer;

   if (typeof content === 'string') {
      buffer = Buffer.from(content);
    } else {
      buffer = content as Buffer;
    }

    const len = buffer.length;
    const amountToPad = 32 - (len % 32);
    const result = Buffer.allocUnsafe(len + amountToPad);
    buffer.copy(result);
    result.fill(amountToPad, len);
    return result;
  }
};

export class Pkcs7Decoder {
  decode(ciphertext: string, encoding: 'base64' | 'hex'): Buffer {
    const content = Buffer.from(ciphertext, encoding);
    const padLength = content[content.length - 1];
    return content.slice(0, content.length - padLength);
  }
  strip(content: Buffer): Buffer|null {
    const padSize = content[content.byteLength - 1];
    if (padSize < 1 || padSize > 32 || padSize > content.byteLength) {
      return null;
    }
    for (let i = padSize; i > 0; i--) {
      if (content[content.byteLength - i] !== padSize) {
        return null;
      }
    }
    return content.slice(0, content.byteLength - padSize);
  }
};
export const genSignature=(timestamp: string, nonce: string)=> {
  const sortedArr = [sysconfig.token, timestamp, nonce].sort().join("");
  // sha1加密
  const signature = sha1(sortedArr);
  return signature;
}

class WxCrypt {
  private aesKey: string;
  private id: string;
  private iv: string;
  private pkcs7Decoder: Pkcs7Decoder;
  private pkcs7Encoder: Pkcs7Encoder;

  constructor(options: CryptOptions) {
    this.aesKey = Base64.decode(options.encodingAESKey); 
    this.id = options.appId;
    if (this.aesKey.length !== 32) {
      console.error('EncodingAESKey: ', options.encodingAESKey);      
      console.error('aesKey: ', this.aesKey );
      //throw new Error('EncodingAESKey should be a 32-length base64 key!');
      this.iv='123456';
    }else{
      this.iv = this.aesKey.slice(0, 16);
    }
    this.pkcs7Decoder = new Pkcs7Decoder();
    this.pkcs7Encoder = new Pkcs7Encoder();
  }

  encrypt(xmlMsg: string): [number, string] {
    const nonce = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now().toString().substring(0, 10);
    const msg = this.pkcs7Encoder.encode(xmlMsg);
    const msgSizeBuffer = Buffer.alloc(4);
    msgSizeBuffer.writeUInt32BE(msg.length, 0);
    const randomBuffer = crypto.randomBytes(16);
    const tinyIdBuffer = Buffer.from(this.id);
    const buffer = Buffer.concat([
      randomBuffer,
      msgSizeBuffer,
      msg,
      tinyIdBuffer,
    ]);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.aesKey), Buffer.from(this.iv));
    cipher.setAutoPadding(false);
    cipher.update(buffer);
    const ciphered = cipher.final();
    const signature = genSignature(timestamp, nonce);
    const xml = this.buildXml(signature, ciphered.toString('base64'), timestamp, nonce);
    return [0, xml];
  }  

  decrypt(ciphered: string, signature: any, timestamp: any, nonce: any): [number, string|null] {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.aesKey), Buffer.from(this.iv));
    decipher.setAutoPadding(false);
    const content = this.pkcs7Decoder.decode(ciphered, 'base64');
    decipher.update(content);
    const buffer = decipher.final();
    const length = buffer.readUInt32BE(0);
    const xmlContent = buffer.slice(4, length + 4).toString('utf-8');
    const fromAppId = buffer.slice(length + 4).toString('utf-8');
    if (fromAppId !== this.id) {
      return [-1, null];
    }
    const msgSignature = genSignature(timestamp, nonce);
    if (msgSignature !== signature) {
      return [-2, null];
    }
    return [0, xmlContent];
  }
  
  private buildXml(signature: string, ciphered: string, timestamp: string, nonce: string) {
    return `
      <xml>
        <Encrypt><![CDATA[${ciphered}]]></Encrypt>
        <MsgSignature><![CDATA[${signature}]]></MsgSignature>
        <TimeStamp>${timestamp}</TimeStamp>
        <Nonce><![CDATA[${nonce}]]></Nonce>
      </xml>
    `;
  }
}

const options: CryptOptions = {
  appId: sysconfig.appID,
  token: sysconfig.token,
  encodingAESKey: sysconfig.encodingAESKey,
};

//export const wxCrypt = new WxCrypt(options);
export default {genSignature};