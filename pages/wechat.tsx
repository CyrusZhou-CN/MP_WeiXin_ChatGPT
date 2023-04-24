import { useState } from 'react';
import crypto from 'crypto';

const WeChat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  // 根据微信公众平台规则生成签名
  function generateSignature(timestamp: string, nonce: string, token: string) {
    const arr = [token, timestamp, nonce];
    arr.sort();
    const str = arr.join('');
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('hex');
  }
  
  // 生成 timestamp 和 nonce
  function generateTimestampAndNonce() {
    const timestamp = String(Date.now());
    const nonce = String(Math.random()).substr(2, 10);
    return { timestamp, nonce };
  }
  
  // 生成 echostr
  function generateEchostr() {
    return String(Math.random()).substr(2, 10);
  }
  
  // 模拟生成请求，传递 signature, timestamp, nonce, echostr
  const token = 'your_token'; // 你的 token
  const { timestamp, nonce } = generateTimestampAndNonce();
  const signature = generateSignature(timestamp, nonce, token);
  const echostr = generateEchostr();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const apiUrl = `/api/wechat?signature=${signature}&timestamp=${timestamp}&nonce=${nonce}&echostr=${echostr}`;// 此处调用上面创建的 wechat.js API 

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(`<xml>
      <ToUserName><![CDATA[gh_651c159bef90]]></ToUserName>
      <FromUserName><![CDATA[ox0ET1RAE4ZFeP08Pikw8K4WxkLo]]></FromUserName>
      <CreateTime>1682097989</CreateTime>
       <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${message}]]></Content>
      <MsgId>24081854051619602</MsgId>
      <Encrypt><![CDATA[ipia2Mxt0IrhgnJyeQRa7lGuKpy/nEp9PoILd/EhYdDWu1IFkqFDUCjNDZ0SU1nl4GGiCU+g5NoSk/vNHCInfNJ/ggCPA+XhP9LKPiwqdR2c2q0ClgVhuvlGrNrXFbIRmhbarp0s0hWZxzqCEVMpZHvJ/gr/BSVEiw/SlC8SJBzxAK+/xoSZA4pvXT37jtg6nxPKicxmjaLv8oho2zdqfuFUpLEfirRKLYY9c79vW/LWJPsoKAjyJYV/HBcDLcdUCPQ0jo/z5Ky7YfnH2TMldry044czZw2BVtg7IwygWTDGdreXu6WCrlrT7nSj8HSmQALFbEafaJjAW4VRsRC0TdGbjxpVVNrcWS513J2JyJAwxYKpWjfvaAnc22twSja3RyXEmgMyABYKOyo8rJ1V7kwABYvAXRl5gJt0UaiM4DE=]]></Encrypt>
      </xml>`),
      headers: { 'Content-Type': 'application/json' },
    });
    const responseText = await apiResponse.text();
    const contentRegex = /<Content><!\[CDATA\[(.*?)\]\]><\/Content>/;
  const contentMatch = responseText.match(contentRegex);
  let content = '';
  if (contentMatch) {
    content = contentMatch[1]; // 获取匹配到的文本内容
    console.log(content);
  } else {
    console.log('无法匹配到内容。');
  }
    setResponse(content);
    setMessage('');
  };

  return (
    <div className="container">
  <style jsx>{`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .input-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      width: 100%;
    }
    .input-container input {
      width: calc(100% - 100px);
      height: 50px;
      font-size: 16px;
      padding: 10px;
      margin-right: 10px;
      box-sizing: border-box;
      border: 2px solid #ccc;
      border-radius: 5px;
    }
    .call-to-action {
      background-color: #1abc9c;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      width: 100px;
    }
    .response-container {
      max-height: 500px;
      overflow-y: scroll;
    }
  `}</style>
  <h1>WeChat Chat Bot Testing Page</h1>
  <form onSubmit={handleSubmit}>
    <div className="input-container">
      <label htmlFor="message">Message: </label>
      <input
        type="text"
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="call-to-action" type="submit">Send</button>
    </div>
  </form>
  {response && (
    <div className="response-container">
      <h2>Response:</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  )}
</div>
  );
};

export default WeChat;
