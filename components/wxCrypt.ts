import sysconfig from "./sysconfig";
import WXBizMsgCrypt from './wx/wxBizMsgCrypt';
import sha1 from 'sha1';
import * as crypto from 'crypto';

export const genSignature=(timestamp: string|string[]|undefined, nonce: string|string[]|undefined)=> {
  const sortedArr = [sysconfig.token, timestamp, nonce].sort().join("");
  // sha1加密
  const signature = sha1(sortedArr);
  return signature;
}

export const genResponseId=(seed: string)=> {
  return crypto
  .createHash('md5') // 使用 MD5 散列算法
  .update(seed)
  .digest('hex')
  .substr(0, 4); // 生成 4 位随机数
}
export const wxBizMsgCrypt=new WXBizMsgCrypt(sysconfig.token,sysconfig.encodingAESKey,sysconfig.appID);

const exportedObject = {
  wxBizMsgCrypt,
  genSignature,
  genResponseId
};

export default exportedObject;
