interface SysConfig {
    openaiTimeout: number;
    appID: string;
    appSecret: string;
    token: string;
    openaiApiKey: string;
    openaiModel: string;
    subscribeReply: string;
    contentTooLong: string;
    encodingAESKey: string;
    isAuthenticated: boolean;
    dbHost: string;
    dbPort: number;
    dbUserName: string;
    dbPassword: string;
    dbDatabase: string;
    dbType: string;
    jwtSecret: string;
  }


const sysconfig: SysConfig = {
  appID: process.env.APP_ID ||'',
  appSecret: process.env.APP_SECRET  ||'',
  token: process.env.TOKEN  ||'' ,
  openaiApiKey: process.env.OPENAI_API_KEY  ||'',
  subscribeReply: process.env.SUBSCRIBE_REPLY  ||'',
  contentTooLong: process.env.CONTENT_TOO_LONG  ||'',
  openaiModel: process.env.OPENAI_MODEL  ||'',
  encodingAESKey: process.env.ENCODING_AES_KEY  ||'',
  openaiTimeout: 60000,
  isAuthenticated: false,
  dbHost : process.env.DB_HOST || '',
  dbPort : 3306,
  dbUserName : process.env.DB_USER || '',
  dbPassword : process.env.DB_PASS || '',
  dbDatabase : process.env.DB_NAME || '',
  dbType : process.env.DB_TYPE || 'mysql',
  jwtSecret : process.env.JWT_SECRET|| 'default-secret'
};
if (process.env.OPENAI_TIMEOUT !== undefined && /^\d+$/.test(process.env.OPENAI_TIMEOUT)) {
  sysconfig.openaiTimeout = parseInt(process.env.OPENAI_TIMEOUT);
}
if (process.env.DB_PORT !== undefined && /^\d+$/.test(process.env.DB_PORT)) {
  sysconfig.dbPort = parseInt(process.env.DB_PORT);
}

if (process.env.IS_AUTHENTICATED !== undefined && process.env.IS_AUTHENTICATED.toLowerCase() === 'true') {
  sysconfig.isAuthenticated = true;
}

export default sysconfig;
