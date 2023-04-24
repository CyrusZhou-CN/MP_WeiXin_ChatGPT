import { NextApiRequest } from "next";
import {genSignature} from "./wxcrypt";
function validateToken(req:NextApiRequest) {
  return new Promise((resolve, reject) => {
    // 获取微信服务器发送的数据
    const { signature, timestamp, nonce, echostr } = req.query;
    // sha1加密
    const result = genSignature(timestamp, nonce);
    if (result === signature) {
      resolve(echostr||"");
    } else {
      reject(new Error("请求不是来自微信服务器，请接入公众号后台"));
    }
  });
}

export default validateToken;
