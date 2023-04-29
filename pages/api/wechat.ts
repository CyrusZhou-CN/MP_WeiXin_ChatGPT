import { NextApiRequest, NextApiResponse } from 'next'
import aichat from "../../components/aichat"
import validateToken from "../../components/validateToken"
import { Message } from "../../components/message"
import { textMessage } from "../../components/template"
import sysconfig from '../../components/sysconfig'
import axiosLibrary from 'axios';
import { getAccessToken } from '../../components/accessToken';
import ReplyCache from '../../components/replyCache';
import SystemLog from '../../components/systemLog';
import { wxBizMsgCrypt, genResponseId } from "../../components/wxCrypt";
import writeToFile from '../../components/log'

async function handleTextMessage(xml: any, res: NextApiResponse, isEncrypt: boolean, sMsgTimestamp: string, sMsgNonce: string): Promise<void> {
  if (!xml || !xml.msgid || !xml.fromusername || !xml.tousername || !xml.content) {
    writeToFile(`error:${xml.fromusername}, ${xml.tousername}`, xml);
    SystemLog.createLog(xml.fromusername, xml.tousername, 'error', `${JSON.stringify(xml)}`); // 输出无效的XML对象
    return;
  }
  const expireAt = new Date(Date.now() + 20 * 1000);
  const timestamp = Date.now(); // 当前时间戳
  const seed = `${timestamp}_${xml.FromUserName}`; // 种子为时间戳和用户的唯一标识符
  const responseId = genResponseId(seed); // 生成 4 位随机数
  // 查询缓存
  const idRegExp = /^([0-9a-zA-Z]{4}|\[[0-9a-zA-Z]{4}\]|【[0-9a-zA-Z]{4}】)$/; // 匹配四位数字、[四位数字]、【四位数字】
  let cache = null;
  let message: Message = {
    FromUserName: xml.fromusername,
    ToUserName: xml.tousername
  };
  if (idRegExp.test(xml.content)) {
    const regulatedStr = xml.content.replace(/[【】[\]]/g, ""); // 替换方括号和圆括号为空字符串
    cache = await ReplyCache.getCacheForResponseId(regulatedStr);
    if (cache==null) {
      message.reply = '服务码错误请检查！';
      const replyXmlMessage = isEncrypt
        ? wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce)[1]
        : textMessage(message);
      writeToFile(`replyXmlMessage:${xml.fromusername}, ${xml.tousername}`, replyXmlMessage);
      sendMessage(res,replyXmlMessage);
      return;
    }
  } else {
    cache = await ReplyCache.getCacheForMsgId(xml.msgid);
  }
  if (cache!==null) {
    // 如果缓存存在且未过期，直接返回响应
    if (cache.reply===null) {
      let ask = 0;
      ask = cache.ask + 1;
      await cache.update({ ask: ask });
      if (ask > 1) {
        message.reply = sysconfig.isAuthenticated
          ? `需要较长时间处理，请稍后得到结果后会马上反馈给您！或者稍后发送服务码【${cache.responseId}】获取结果`
          : `需要较长时间处理，由于公众号还没有认证，请稍后发送服务码【${cache.responseId}】获取结果`;
        try {
          const replyXmlMessage = isEncrypt
            ? wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce)[1]
            : textMessage(message);
          writeToFile(`replyXmlMessage:${xml.fromusername}, ${xml.tousername}`, replyXmlMessage);
          sendMessage(res,replyXmlMessage);          
        } catch (error) {
          writeToFile(`error:${xml.fromusername}, ${xml.tousername}`, error);
          SystemLog.createLog(xml.fromusername, xml.tousername, 'error', `${JSON.stringify(error)}`);
        }
      }
    } else {
      try {
        message.reply = cache.reply;
        const replyXmlMessage = isEncrypt
          ? wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce)[1]
          : textMessage(message);
        writeToFile(`replyXmlMessage:${xml.fromusername}, ${xml.tousername}`, replyXmlMessage);
        sendMessage(res,replyXmlMessage);
      } catch (error) {
        writeToFile(`error:${xml.fromusername}, ${xml.tousername}`, error);
        SystemLog.createLog(xml.fromusername, xml.tousername, 'error', `${JSON.stringify(error)}`);
      }
    }
  } else {
    // 如果缓存不存在或已过期，则查询 AI Chat Bot 并保存缓存和请求
    const newRecord = await ReplyCache.saveCache(xml.fromusername, xml.tousername, xml.msgid, responseId, xml.content, null, expireAt); // 将响应 ID 插入数据库
    const reply = await aichat.getReply(xml.content);
    writeToFile(`aichat.getReply:${xml.fromusername}, ${xml.tousername}`, reply);
    let [text,nextText] = await truncatedString(reply);    
    let nextResId = genResponseId(`${text}_${Date.now()}_${xml.FromUserName}`)
    text = `${text}\n下一页发送【${nextResId}】获取结果`;
    await newRecord.update({ reply: text }); // 将响应数据更新到数据库
    while (nextText.length>0) {
      [text,nextText] = await truncatedString(nextText);
      let resId = genResponseId(`${text}_${Date.now()}_${xml.FromUserName}`)
      if (nextText.length>0) {        
        text = `${text}\n下一页发送【${resId}】获取结果`;
      }
      await ReplyCache.saveCache(xml.fromusername, xml.tousername, xml.msgid, nextResId, '', text, new Date(Date.now() + 60 * 60 * 24 * 1000))
      nextResId = resId;
    }
    try {
      message.reply = text;
      const replyXmlMessage = isEncrypt
        ? wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce)[1]
        : textMessage(message);
      writeToFile(`replyXmlMessage:${xml.fromusername}, ${xml.tousername}`, replyXmlMessage);
      sendMessage(res,replyXmlMessage);
      if (sysconfig.isAuthenticated) {
        const AccessToken = await getAccessToken();
        const replyRes = await axiosLibrary.post(
          `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${AccessToken}`,
          replyXmlMessage,
          {
            headers: {
              'Content-Type': 'application/xml;charset=utf-8',
              'Content-Length': Buffer.byteLength(replyXmlMessage, 'utf8'),
            },
          }
        );
        writeToFile(`info:${xml.fromusername}, ${xml.tousername}`, replyRes);
        SystemLog.createLog(xml.fromusername, xml.tousername, 'info', `${JSON.stringify(replyRes)}`);
      }
    } catch (error) {
      writeToFile(`error:${xml.fromusername}, ${xml.tousername}`, error);
      SystemLog.createLog(xml.fromusername, xml.tousername, 'error', `${JSON.stringify(error)}`);
    }
  }
}
function sendMessage(res: NextApiResponse, replyXmlMessage: string) {
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(replyXmlMessage);
}

async function truncatedString(text: string) {
  const truncatedReply= truncatedToByteString(text,1000);
  let savString='';
  if (truncatedReply.length < text.length) {
    savString = text.substring(truncatedReply.length, text.length-truncatedReply.length);    
  }
  return [truncatedReply,savString];
}
// 返回指定字节的文字
function truncatedToByteString(content: string,length:number): string {
  let byteCount = 0;
  let result = '';
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code >= 0x0001 && code <= 0x007F) {
      byteCount += 1;
    } else if (code >= 0x0080 && code <= 0x07FF) {
      byteCount += 2;
    } else if (code >= 0x0800 && code <= 0xFFFF) {
      byteCount += 3;
    } else {
      byteCount += 4;
    }
    if (byteCount <= length) {
      result += content.charAt(i);
    } else {
      break;
    }
  }
  return result;
}

async function handleSubscribeEvent(xml: any, res: NextApiResponse): Promise<void> {
  const message: Message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: sysconfig.subscribeReply };
  res.send(textMessage(message).toString());
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { signature, timestamp, nonce, echostr, encrypt_type, msg_signature } = req.query;
  const sMsgTimestamp = timestamp as string;
  const sMsgNonce = nonce as string;
  const msgSignature = signature as string;
  const sMsgSignature = msg_signature as string;
  let result;
  try {
    result = await validateToken(req);
  } catch (error: any) {
    writeToFile('error', error);
    //console.error(error.message);
  }
  switch (method) {
    case 'GET':
      res.send(result);
      break;
    case 'POST':
      const sMsg = req.body;
      writeToFile("req.query:", req.query);
      writeToFile("req.typeof:", typeof sMsg);
      writeToFile('req.body:', sMsg);
      let [co, xml] = wxBizMsgCrypt.parseFromString(sMsg);
      let isEncrypt = false;
      if (xml?.encrypt && !xml?.content) {
        isEncrypt = true;
        const [dc, decryptedMessage] = wxBizMsgCrypt.decryptMsg(sMsgSignature, sMsgTimestamp, sMsgNonce, sMsg);
        let [_, xmls] = wxBizMsgCrypt.parseFromString(decryptedMessage);
        xml = xmls;
      }
      const msgType = xml?.msgtype;
      switch (msgType) {
        case "text":
          await handleTextMessage(xml, res, isEncrypt, sMsgTimestamp, sMsgNonce);
          break;
        case "event":
          switch (xml?.event) {
            case "subscribe":
              await handleSubscribeEvent(xml, res);
              break;
            case "unsubscribe":
            default:
              res.send("");
              break;
          }
          break;
        default:
          res.send("");
          break;
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};
