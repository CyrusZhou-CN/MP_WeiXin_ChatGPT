import { NextApiRequest, NextApiResponse } from 'next'
import aichat from "../../components/aichat"
import validateToken from "../../components/validateToken"
import { Cache } from "memory-cache"
import { Message ,XmlMessage } from "../../components/message"
import { textMessage } from "../../components/template"
import sysconfig from '../../components/sysconfig'
import { DOMParser } from 'xmldom'

const REPLY_CACHE_DURATION = 20000;
const REPLY_CACHE_MAX_ATTEMPTS = 3;
interface ReplyCache {
  count: number;
  reply: string;
  timestamp: number;
}
const replyCache = new Cache();

async function handleTextMessage(xml: any,res: NextApiResponse): Promise<void> {
  if (!xml || !xml.msgid || !xml.fromusername || !xml.tousername || !xml.content) {
    console.log('Invalid XML object:', xml); // 输出无效的XML对象
    return;
  }
  const key = "__express__" + xml.msgid;

  const replyObj = replyCache.get(key) as ReplyCache | undefined;
  const timestamp = Date.now();

  if (replyObj?.count && timestamp - replyObj.timestamp < REPLY_CACHE_DURATION) {
    if (replyObj.count >= REPLY_CACHE_MAX_ATTEMPTS) {
      const message: Message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: sysconfig.contentTooLong };
      res.send(textMessage(message));
      return;
    }
    replyCache.put(key, { count: replyObj.count + 1, reply: replyObj.reply, timestamp }, REPLY_CACHE_DURATION);
    res.send(replyObj.reply);
    return;
  }  

  const reply = await aichat.getReply(xml.fromusername,xml.content);
  console.log(reply);
  const message: Message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply };
  replyCache.put(key, { count: 1, reply: textMessage(message), timestamp }, REPLY_CACHE_DURATION);
  res.send(textMessage(message));
}

async function handleSubscribeEvent(xml: any, res: NextApiResponse): Promise<void> {
  const message: Message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply: sysconfig.subscribeReply };
  res.send(textMessage(message).toString());
}
export default async (req: NextApiRequest, res: NextApiResponse) => { 
  const { method } = req;
  let result;
  try {
    result= await validateToken(req);   
    console.info(result); 
  } catch (error: any) {
    console.error(error.message);
  }
  switch (method) {
    case 'GET':
      res.send(result);
      break;
    case 'POST':
      console.log(typeof req.body); // 应该输出 "object"
      console.log(req.body); 
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(req.body, "text/xml");
      let xml: XmlMessage = {
        tousername: xmlDoc.getElementsByTagName('ToUserName')[0]?.textContent || '',
        fromusername: xmlDoc.getElementsByTagName('FromUserName')[0]?.textContent || '',
        createtime: parseInt(xmlDoc.getElementsByTagName('CreateTime')[0]?.textContent || '0', 10),
        msgtype: xmlDoc.getElementsByTagName('MsgType')[0]?.textContent || '',
        content: xmlDoc.getElementsByTagName('Content')[0]?.textContent || '',
        msgid: xmlDoc.getElementsByTagName('MsgId')[0]?.textContent || '',
        event: xmlDoc.getElementsByTagName('Event')[0]?.textContent || '',
        eventkey: xmlDoc.getElementsByTagName('EventKey')[0]?.textContent || '',
        encrypt: xmlDoc.getElementsByTagName('Encrypt')[0]?.textContent || '',
      };
      // if(xml.encrypt){
      //   console.log(typeof xml); // 应该输出 "object"
      //   console.log(xml); // 应该输出您提供的 XML 数据对象
      // }
      const msgType = xml.msgtype;
      switch (msgType) {
        case "text":
          await handleTextMessage(xml,res);
          break;
        case "event":
            switch (xml.event) {
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