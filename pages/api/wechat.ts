import { NextApiRequest, NextApiResponse } from 'next'
import aichat from "../../components/aichat"
import validateToken from "../../components/validateToken"
import { Message, XmlMessage } from "../../components/message"
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
    SystemLog.createLog(xml.fromusername, xml.tousername, 'error', `${JSON.stringify(xml)}`); // 输出无效的XML对象
    return;
  }
  const expireAt = new Date(Date.now() + 20 * 1000);
  const timestamp = Date.now(); // 当前时间戳
  const seed = `${timestamp}_${xml.FromUserName}`; // 种子为时间戳和用户的唯一标识符
  const responseId = genResponseId(seed); // 生成 4 位随机数
  // 查询缓存
  const idRegExp = /^([0-9a-zA-Z]{4}|\[[0-9a-zA-Z]{4}\]|【[0-9a-zA-Z]{4}】)$/; // 匹配四位数字、[四位数字]、【四位数字】
  let result = '';
  let cache = null;
  if (idRegExp.test(xml.content)) {
    const regulatedStr = xml.content.replace(/[【】[\]]/g, ""); // 替换方括号和圆括号为空字符串
    const rows = await ReplyCache.getCache(regulatedStr);
    if (Array.isArray(rows)) { // 判断是否为数组类型
      cache = rows[0];
      rows.forEach((row: any) => {
        const { reply } = row;
        if (reply) {
          result += `${reply}\n`; // 添加换行符 `\n`
        }
      });
    } else {
      const { reply } = rows as any; // 单个对象
      cache = rows;
      if (reply) {
        result = `${reply}`;
      }
    }
    //console.log('rows:', rows);
    writeToFile("rows:", rows);
  }
  if (cache) {
    // 如果缓存存在且未过期，直接返回响应
    let message;
    if (result) {
      message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: result };
    } else {
      message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: '正在处理，请稍后...' };
    }
    if (isEncrypt) {
      const [c, d] = wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce);
      res.send(d);
    } else {
      res.send(textMessage(message));
    }
  } else {
    // 如果缓存不存在或已过期，则查询 AI Chat Bot 并保存缓存和请求
    const newRecord = await ReplyCache.saveCache(xml.fromusername, xml.tousername, xml.msgid, responseId, xml.content, null, expireAt); // 将响应 ID 插入数据库
    let message;
    if (sysconfig.isAuthenticated === true) {
      message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: `正在处理【${responseId}】，请稍后得到结果后会马上反馈给您！` };
    } else {
      message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: `正在处理，由于公众号还没有认证，请稍后发送【${responseId}】获取结果` };
    }
    if (isEncrypt) {
      const [c, d] = wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce);
      res.send(d);
    } else {
      res.send(textMessage(message));
    }
    const reply = await aichat.getReply(xml.content);
    await newRecord.update({ reply: reply }); // 将响应数据更新到数据库
    if (sysconfig.isAuthenticated === true) {
      try {
        let replyXmlMessage = '';
        if (isEncrypt) {
          const [c, d] = wxBizMsgCrypt.encryptMsg(textMessage(message), sMsgTimestamp, sMsgNonce);
          replyXmlMessage = d;
        } else {
          replyXmlMessage = textMessage(message);
        }
        const AccessToken = await getAccessToken();
        const replyRes = await axiosLibrary.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${AccessToken}`,
          replyXmlMessage, {
          headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'Content-Length': Buffer.byteLength(replyXmlMessage, 'utf8')
          }
        });
        SystemLog.createLog(xml.fromusername, xml.tousername, 'info', `${JSON.stringify(replyRes)}`);
      } catch (error) {
        SystemLog.createLog(xml.fromusername, xml.tousername, 'error', `${JSON.stringify(error)}`);
      }
    }
  }
}

async function handleSubscribeEvent(xml: any, res: NextApiResponse): Promise<void> {
  const message: Message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: sysconfig.subscribeReply };
  res.send(textMessage(message).toString());
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { signature, timestamp, nonce, echostr,encrypt_type, msg_signature} = req.query;
  const sMsgTimestamp = timestamp as string;
  const sMsgNonce = nonce as string;
  const msgSignature = signature as string;
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
      writeToFile("req.query:", typeof sMsg);
      writeToFile('req.body:', sMsg);
      let [co, xml] = wxBizMsgCrypt.parseFromString(sMsg);
      let isEncrypt = false;
      if (xml?.encrypt && !xml?.content) {
        isEncrypt = true;
        const [dc, decryptedMessage] = wxBizMsgCrypt.decryptMsg(msgSignature, sMsgTimestamp, sMsgNonce, sMsg);
        let [_, xmls] = wxBizMsgCrypt.parseFromString(decryptedMessage);
        xml = xmls;
      }
      const msgType = xml?.msgtype;
      switch (msgType) {
        case "text":
          await handleTextMessage(xml, res, isEncrypt, msgSignature, sMsgNonce);
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
