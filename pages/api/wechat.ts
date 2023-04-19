import { NextApiRequest, NextApiResponse } from 'next'
import openai from "../../components/openai"
import validateToken from "../../components/validateToken"
import { Cache } from "memory-cache"
import { Message } from "../../components/message"
import { textMessage } from "../../components/template"

const REPLY_CACHE_DURATION = 20000;
const REPLY_CACHE_MAX_ATTEMPTS = 3;
interface ReplyCache {
  count: number;
  reply: string;
  timestamp: number;
}
const replyCache = new Cache();

async function handleTextMessage(xml: any, res: NextApiResponse): Promise<void> {
  const key = "__express__" + xml.msgid[0];
  const replyObj = replyCache.get(key) as ReplyCache | undefined;
  const timestamp = Date.now();

  if (replyObj?.count && timestamp - replyObj.timestamp < REPLY_CACHE_DURATION) {
    if (replyObj.count >= REPLY_CACHE_MAX_ATTEMPTS) {
      const message: Message = { FromUserName: xml.fromusername[0], ToUserName: xml.tousername[0], reply: "答案太长，超时了，请重新提问" };
      res.send(textMessage(message));
      return;
    }
    replyCache.put(key, { count: replyObj.count + 1, reply: replyObj.reply, timestamp }, REPLY_CACHE_DURATION);
    return;
  }

  const reply = await openai.getReply(xml.content[0]);
  const message: Message = { FromUserName: xml.fromusername[0], ToUserName: xml.tousername[0], reply };
  replyCache.put(key, { count: 1, reply: textMessage(message), timestamp }, REPLY_CACHE_DURATION);
  res.send(textMessage(message));
}

async function handleSubscribeEvent(xml: any, res: NextApiResponse): Promise<void> {
  const message: Message = { FromUserName: xml.fromusername[0], ToUserName: xml.tousername[0], reply: "欢迎关注，可直接向ChatGPT提问" };
  res.send(textMessage(message));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {  
  const { method } = req;
  let result;
  try {
    result= await validateToken(req);    
  } catch (error) {
    console.error(error);
    res.status(500).json(`Internal Server Error: ${error.message}`);
    return;
  }
  switch (method) {
    case 'GET':
      res.status(200).json(result);
      break;
    case 'POST':
      const xml = req.body;
      const msgType = xml.msgtype[0];
      switch (msgType) {
        case "text":
          await handleTextMessage(xml, res);
          break;
        case "event":
          if (xml.event && xml.event[0] === "subscribe") {
            await handleSubscribeEvent(xml, res);
          } else {
            res.send("");
          }
          break;
        default:
          res.send("");
          break;
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json(`Method ${method} Not Allowed`);
      break;
  }
};
