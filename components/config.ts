
import dotenv from 'dotenv';
interface Config {
    appID: string;
    appSecret: string;
    token: string;
    OPENAI_API_KEY: string;
  }

dotenv.config();

interface Config {
  appID: string;
  appSecret: string;
  token: string;
  OPENAI_API_KEY: string;
}

const config: Config = {
  appID: process.env.APP_ID ||'',
  appSecret: process.env.APP_SECRET  ||'',
  token: process.env.TOKEN  ||'' ,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY  ||'',
};

export default config;
