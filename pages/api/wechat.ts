import { NextApiRequest, NextApiResponse } from 'next'
import aichat from "../../components/aichat"
import validateToken from "../../components/validateToken"
import { Message ,XmlMessage } from "../../components/message"
import { textMessage } from "../../components/template"
import sysconfig from '../../components/sysconfig'
import { DOMParser } from 'xmldom'
import axiosLibrary from 'axios';
import { getAccessToken } from '../../components/accessToken';
import ReplyCache from '../../components/replyCache';
import SystemLog from '../../components/systemLog';
import * as crypto from 'crypto';

async function handleTextMessage(xml: any,res: NextApiResponse): Promise<void> {
  if (!xml || !xml.msgid || !xml.fromusername || !xml.tousername || !xml.content) {
    SystemLog.createLog('error', `${JSON.stringify(xml)}`); // 输出无效的XML对象
    return;
  }
  const expireAt = new Date(Date.now() + 20 * 1000);
  const timestamp = Date.now(); // 当前时间戳
  const seed = `${timestamp}_${xml.FromUserName}`; // 种子为时间戳和用户的唯一标识符
  const responseId =crypto
    .createHash('md5') // 使用 MD5 散列算法
    .update(seed)
    .digest('hex')
    .substr(0, 4); // 生成 4 位随机数
  // 查询缓存
  console.log('responseId:',responseId);
  const idRegExp = /^([0-9a-zA-Z]{4}|\[[0-9a-zA-Z]{4}\]|【[0-9a-zA-Z]{4}】)$/; // 匹配四位数字、[四位数字]、【四位数字】
  let result = '';
  let cache=null;
  if(idRegExp.test(xml.content)){
    const regulatedStr = xml.content.replace(/[【】[\]]/g, ""); // 替换方括号和圆括号为空字符串
    console.log('regulatedStr:',regulatedStr);
    const rows = await ReplyCache.getCache(xml.msgid,regulatedStr);     
        if (Array.isArray(rows)) { // 判断是否为数组类型
          cache=rows[0];
          rows.forEach((row: any) => {
            const { reply } = row;
            if (reply) {
              result += `${reply}\n`; // 添加换行符 `\n`
            }
          });
        } else {
          const { reply } = rows as any; // 单个对象
          cache=rows;
          if (reply) {
            result = `${reply}`;
          }
        }
        console.log('rows:',rows);
  }
  console.log('result:',result);
  console.log('cache:',cache);
  if (cache) {
    // 如果缓存存在且未过期，直接返回响应
    let message;
    if(result) {
      message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply:result };
    }else{
      message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply:'正在处理，请稍后...' };
    }
    res.send(textMessage(message));
  } else {
    // 如果缓存不存在或已过期，则查询 AI Chat Bot 并保存缓存和请求
    const newRecord = await ReplyCache.saveCache(xml.msgid,responseId, xml.content, null, expireAt); // 将响应 ID 插入数据库
    if (sysconfig.isAuthenticated===true){
      res.send(`正在处理【${responseId}】，请稍后得到结果会反馈给您，或者稍后发送【${responseId}】获取结果`);      
    }else{
      const message: Message = { FromUserName: xml.fromusername, ToUserName: xml.tousername, reply:`正在处理，请稍后发送【${responseId}】获取结果` };
      res.send(textMessage(message));
    }
    const reply = await aichat.getReply(xml.content);
    await newRecord.update({reply:reply}); // 将响应数据更新到数据库
    if (sysconfig.isAuthenticated===true){ 
      try {
        const replyXmlMessage = textMessage({ FromUserName: xml.fromusername, ToUserName: xml.tousername, reply:reply});
        const AccessToken = await getAccessToken();
        const replyRes = await axiosLibrary.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${AccessToken}`,
          replyXmlMessage, {
          headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'Content-Length': Buffer.byteLength(replyXmlMessage, 'utf8')
          }
        });
        SystemLog.createLog('info', `${JSON.stringify(replyRes)}`);
      } catch (error) {
        SystemLog.createLog('error', `${JSON.stringify(error)}`);
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
      if(xml.encrypt){
        console.log(typeof xml); // 应该输出 "object"
        console.log(xml); // 应该输出您提供的 XML 数据对象
      }
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
