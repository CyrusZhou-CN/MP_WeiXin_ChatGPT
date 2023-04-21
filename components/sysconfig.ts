
import dotenv from 'dotenv';
interface SysConfig {
    appID: string;
    appSecret: string;
    token: string;
    openaiApiKey: string;
    openaiModel: string;
    subscribeReply: string;
    contentTooLong: string;
    encodingAESKey: string;
  }

dotenv.config();


const sysconfig: SysConfig = {
  appID: process.env.APP_ID ||'',
  appSecret: process.env.APP_SECRET  ||'',
  token: process.env.TOKEN  ||'' ,
  openaiApiKey: process.env.OPENAI_API_KEY  ||'',
  subscribeReply: process.env.SUBSCRIBE_REPLY  ||'',
  contentTooLong: process.env.CONTENT_TOO_LONG  ||'',
  openaiModel: process.env.OPENAI_MODEL  ||'',
  encodingAESKey: process.env.ENCODING_AES_KEY  ||'',
};

export default sysconfig;
