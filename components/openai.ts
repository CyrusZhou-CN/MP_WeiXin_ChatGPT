import axios from "axios";
import config from "./config";

// 调用openai接口获取回答
export default {
  getReply: async (text: string): Promise<string> => {
    return axios
      .post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          prompt: text,
          max_tokens: 2048,
          n: 1,
          stop: "\n*********\n",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.OPENAI_API_KEY}`, // 密钥
          },
        }
      )
      .then((res) => {
        const reply = res.data.choices[0].text.replace(/^\n.*/g, "");
        console.log(`Q:${text}\nA:${reply}`);
        return reply;
      })
      .catch((err) => {
        console.error(err);
        return "提问出现了点问题，请重新问一遍吧！";
      });
 }
}