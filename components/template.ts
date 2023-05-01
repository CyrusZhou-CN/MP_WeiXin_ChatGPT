import { Message } from "./message"; // 假设 message 模块中定义了 Message 类型
// 回复文本消息
export function textMessage(message: Message): string {
  message.CreateTime = new Date().getTime();
  return `<xml>
<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
<CreateTime>${message.CreateTime}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${message.reply}]]></Content>
</xml>`;
}
// 回复图片消息
export function imageMessage(message: Message): string {
  const createTime = new Date().getTime();
  return `<xml>
<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
<CreateTime>${createTime}</CreateTime>
<MsgType><![CDATA[image]]></MsgType>
<Image>
<MediaId><![CDATA[${message.mediaId}]]></MediaId>
</Image>
</xml>`;
}

// 回复语音消息
export function voiceMessage(message: Message): string {
  const createTime = new Date().getTime();
  return `<xml>
<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
<CreateTime>${createTime}</CreateTime>
<MsgType><![CDATA[voice]]></MsgType>
<Voice>
<MediaId><![CDATA[${message.mediaId}]]></MediaId>
</Voice>
</xml>`;
}

// 回复视频消息
export function videoMessage(message: Message): string {
  const createTime = new Date().getTime();
  return `<xml>
<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
<CreateTime>${createTime}</CreateTime>
<MsgType><![CDATA[video]]></MsgType>
<Video>
<MediaId><![CDATA[${message.mediaId}]]></MediaId>
<Title><![CDATA[${message.title}]]></Title>
<Description><![CDATA[${message.description}]]></Description>
</Video>
</xml>`;
}

// 回复图文消息
export function articleMessage(message: Message): string {
  const createTime = new Date().getTime();
  return `<xml>
<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
<CreateTime>${createTime}</CreateTime>
<MsgType><![CDATA[news]]></MsgType>
<ArticleCount>${message.articles?.length}</ArticleCount>
<Articles>
${message.articles?.map(
(article) =>
`<item><Title><![CDATA[${article.title}]]></Title>
<Description><![CDATA[${article.description}]]></Description>
<PicUrl><![CDATA[${article.img}]]></PicUrl>
<Url><![CDATA[${article.url}]]></Url></item>`
)
.join("")}
</Articles>
</xml>`;
}