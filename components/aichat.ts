import sysconfig from "./sysconfig";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi
} from "openai";
const configuration = new Configuration({
  apiKey: sysconfig.openaiApiKey
});
const openai = new OpenAIApi(configuration);
const getReply = async (user:string,text: string): Promise<string> => {
  try {
    const messages:Array<ChatCompletionRequestMessage> = [{
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: text
    }];
    const response = await openai.createChatCompletion({
      model: sysconfig.openaiModel,
      messages: messages,
      temperature: 1,
      max_tokens: 2000,
      presence_penalty: 0,
    },{
      timeout: 9000,
      timeoutErrorMessage: '提问超时，请简化你的问题,请重试',
      headers: {
        "Content-Encoding": "gzip",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
    const reply =  response.data.choices[0].message?.content.replace(/^\n+|\n+$/g, "")
    return reply || '没有找到答案，请问其他问题吧！';
  } catch (error: any) {
    console.error(`Error: ${error}`);
    return error.message || '没有找到答案，请问其他问题吧！';
  }
};

export default {
  getReply
};
