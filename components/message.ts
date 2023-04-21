export interface Message {
    ToUserName: string;
    FromUserName: string;
    CreateTime?: number;
    MsgType?: string;
    reply?: string;
    mediaId?: string;
    title?: string;
    description?: string;
    articles?: Article[];
  }
  export interface Article {
    title: string;
    description: string;
    img: string;
    url: string;
  }
  export interface XmlMessage {
    event?: string;
    tousername: string,
    fromusername: string,
    createtime: number,
    msgtype: string,
    content: string,
    msgid: string,
    eventkey: string,
    encrypt: string,
  }
  