import sha1 from "sha1"; // sha1 为第三方加密模块
import config from "../components/config";

function validateToken(req:any) {
  return new Promise((resolve, reject) => {
    // 获取微信服务器发送的数据
    const { signature, timestamp, nonce, echostr } = req.query;

    // token、timestamp、nonce三个参数进行字典序排序
    const sortedArr = [config.token, timestamp, nonce].sort().join("");
    // sha1加密
    const result = sha1(sortedArr);

    if (result === signature) {
      resolve(echostr);
    } else {
      reject(new Error("请求不是来自微信服务器，请接入公众号后台"));
    }
  });
}

export default validateToken;
