import axios from "axios";
import fs from "fs";
import sysconfig from "./sysconfig";
import writeToFile from "./log";

const fileUrl = "./access_token.json";

const readAccessToken = (): string | undefined => {
  try {
    const accessTokenStr = fs.readFileSync(fileUrl, "utf8");
    const accessToken = JSON.parse(accessTokenStr);
    const expireTime = new Date(accessToken.expireTime).getTime();
    const currentTime = new Date().getTime();

    if (accessToken.token && expireTime > currentTime) {
      //console.log("get access_token from local file", accessToken.token);
      writeToFile("get access_token from local file", accessToken.token);
      return accessToken.token;
    }

    //console.log("access_token expired");
    writeToFile("get access_token from local file", "access_token expired");
    return undefined;
  } catch (e :any) {
    //console.log("read access_token error:", e.message);
    writeToFile('error', e);
    return undefined;
  }
};

const writeAccessToken = async (): Promise<void> => {
  const res = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${sysconfig.appID}&secret=${sysconfig.appSecret}`
  );

  if (!res.data.access_token || !res.data.expires_in) {
    //console.error("ACCESS_TOKEN为空", res.data);
    writeToFile('ACCESS_TOKEN为空', res);
    throw new Error("access_token为空");
  }

  const now = new Date();
  const expireTime = now.getTime() + res.data.expires_in * 1000;
  const accessToken = {
    token: res.data.access_token,
    expireTime: expireTime,
  };

  fs.writeFileSync(fileUrl, JSON.stringify(accessToken));
  writeToFile("get access_token from server", accessToken.token);
  //console.log("get access_token from server", accessToken.token);
};

export const getAccessToken = async (): Promise<string> => {
  const token = readAccessToken();

  if (token !== undefined) {
    return token;
  }

  await writeAccessToken();

  return readAccessToken() || "";
};
const getAccess =  {
  getAccessToken
}
export default getAccess;
