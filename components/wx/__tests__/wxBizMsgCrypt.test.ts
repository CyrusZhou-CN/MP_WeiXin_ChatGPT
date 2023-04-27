import sysconfig from '../../sysconfig';
import {WXBizMsgCrypt} from '../wxBizMsgCrypt';
import { DOMParser } from 'xmldom'

test('encrypt and decrypt message with WXBizMsgCrypt', () => {
  const encodingAesKey = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG';
  const token = 'pamtest';
  const timeStamp = '1409304348';
  const nonce = 'xxxxxx';
  const appId = 'wxb11529c136998cb6';
  const originalMsg = '<xml><ToUserName><![CDATA[oia2Tj我是中文jewbmiOUlr6X-1crbLOvLw]]></ToUserName><FromUserName><![CDATA[gh_7f083739789a]]></FromUserName><CreateTime>1407743423</CreateTime><MsgType><![CDATA[video]]></MsgType><Video><MediaId><![CDATA[eYJ1MbwPRJtOvIEabaxHs7TX2D-HV71s79GUxqdUkjm6Gs2Ed1KF3ulAOA9H1xG0]]></MediaId><Title><![CDATA[testCallBackReplyVideo]]></Title><Description><![CDATA[testCallBackReplyVideo]]></Description></Video></xml>';

  const crypter = new WXBizMsgCrypt(token, encodingAesKey, appId);

  let [errCode,encryptedMsg] = crypter.encryptMsg(originalMsg, timeStamp, nonce);
  expect(errCode).toBe(0);

  let xmlTree = new DOMParser().parseFromString(encryptedMsg, 'text/xml');

  let encryptNode = xmlTree.getElementsByTagName('Encrypt')[0];
  let msgSignNode = xmlTree.getElementsByTagName('MsgSignature')[0];
  let encrypted = encryptNode.textContent ||"";
  let msgSign = msgSignNode.textContent ||"";

  let [deerrCode, decodedMsg] = crypter.decryptMsg(msgSign, timeStamp, nonce, encryptedMsg);
  expect(deerrCode).toBe(0);
  expect(decodedMsg).toBe(originalMsg);
});
test('decrypt [WeiXin] message with WXBizMsgCrypt', () => {
  const timeStamp = '1682516881';
  const nonce = '1286607531';
  const msg_signature = 'bb10af24bdc231d8e89279a4c3a5b5397e40b881';
  const originalMsg = `<xml><ToUserName><![CDATA[gh_651c159bef90]]></ToUserName><Encrypt><![CDATA[TBgsmBoUXl1rt5Ev1jtcr0zzV7NlQvIi1W2K57kP4kMB8hGCzijqWt1qMPqXTRLZYMywDMHa0Ib9HNZ6UdyLNA6q71oaxX4tuJlllAVUppaehZPRZZS75WO2o6xzoDddNaFM/xNa5mtg7zWtXVTtdjovcvwqHkoe6WzyQ96IcWf8Xxzgl07+tHAtoTEbVqIAz5PpkUAc4wntlqgpRI7yN8aLOZAlFlo9nykF0Yr9hAcfg7+wt7V6kXyOOdZXIkIjxIxVmGLvEncAGN5tcb1RRUZ+h6cpSULu18GFDOEuntp153JB41eQ30FylloodeXQpd9eIrz6vdPjuM0Uzur1aS3GfpZ+n/YonUmGzGs8MNqLY0k7aFuIC3v69GQzs/CJsmFqFUCfQT9Pvr1qrPzIVMHXxh2RrqXOJ4PolpHoa3/XZT49Sv6ivs7fzZNhyIfIHKi1wYDK3HLf2uVyUEcuxQ==]]></Encrypt></xml>`
  const crypter = new WXBizMsgCrypt(sysconfig.token, sysconfig.encodingAESKey, sysconfig.appID);
  const BeDecodedMsg ='<xml><ToUserName><![CDATA[gh_651c159bef90]]></ToUserName>\n'
        +'<FromUserName><![CDATA[ox0ET1RAE4ZFeP08Pikw8K4WxkLo]]></FromUserName>\n'
        +'<CreateTime>1682516880</CreateTime>\n'
        +'<MsgType><![CDATA[text]]></MsgType>\n'
        +'<Content><![CDATA[兼容模式]]></Content>\n'
        +'<MsgId>24087850633297219</MsgId>\n'
        +'</xml>';
  let [deerrCode, decodedMsg] = crypter.decryptMsg(msg_signature, timeStamp, nonce, originalMsg);
  expect(deerrCode).toBe(0);
  expect(decodedMsg).toBe(BeDecodedMsg);
});