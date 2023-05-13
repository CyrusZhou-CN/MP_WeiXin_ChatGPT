[Italiano](README.IT.md) | [English](README.EN.md)

# 快速开始

[![创建Vercel Postgres数据库](./public/images/postgreSQL.png)](https://vercel.com/cyruszhou-cn/mp-wei-xin-chat-gpt/stores)   [![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCyrusZhou-CN%2FMP_WeiXin_ChatGPT&env=OPENAI_API_KEY&env=APP_ID&env=APP_SECRET&env=TOKEN&env=NEXTAUTH_URL&env=DB_TYPE&env=DB_HOST&env=DB_PORT&env=DB_USER&env=DB_PASS&env=DB_NAME&repository-name=MP_WeiXin_ChatGPT)  [![在 Gitpod 中打开](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/CyrusZhou-CN/MP_WeiXin_ChatGPT)

# 微信公众号对接ChatGPT程序

这是一个基于 Next.js 开发的微信公众号对接 ChatGPT 程序，可以通过微信公众号直接向 ChatGPT 提问并获取答案。

## 配置
1. 克隆本仓库到本地，并进入项目目录。

   ```
   git clone https://github.com/CyrusZhou-CN/MP_WeiXin_ChatGPT.git
   cd MP_WeiXin_ChatGPT
   ```

2. 在项目根目录创建一个 `.env` 文件。

3. 在 `.env` 文件中添加以下配置参数，并替换为实际的参数值。

   ```
   APP_ID=your_app_id
   APP_SECRET=your_app_secret
   TOKEN=your_token
   ENCODING_AES_KEY=（开启 安全模式 时需要）
   SUBSCRIBE_REPLY=欢迎关注，可直接向ChatGPT提问
   CONTENT_TOO_LONG=答案太长，超时了，请重新提问
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-3.5-turbo
   OPENAI_TIMEOUT=60000
   IS_AUTHENTICATED=false
   NEXTAUTH_SECRET=(可以用命令生成openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000/(发布后需要改成实际的网站地址)
   MYSQL_HOST=localhost
   MYSQL_PORT=6306
   MYSQL_USER=weixin
   MYSQL_PASSWORD=weixin
   MYSQL_DATABASE=weixin
   VERCEL=false
   ```

4. 将以上配置参数中的 `your_app_id`、`your_app_secret`、`your_token`、`your_encoding_aes_key` 和 `your_openai_api_key` 分别替换为通过 [公众号开发者平台](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login) 获取的实际参数值和 [OpenAI API Key](https://platform.openai.com/account/api-keys)。

   ![公众平台调试接口](./public/images/weixin.jpg)

   注意：在微信公众号管理后台中，URL 的地址是以您的服务器地址为开头的完整地址，如 http://yourdomain.com/api/wechat

## 运行说明
### 快速启动mysql测试数据库
```
docker compose up -d 
```
### 调试运行
1. 在项目根目录执行以下命令，安装依赖包。

   ```
   npm install
   ```
2. 验证数据库
```
npm test  
```
3. 执行以下命令，启动开发服务器。

   ```
   npm run dev
   ```

4. 在微信公众号管理后台中配置服务器地址，并将 Token 填写为配置文件中的 `TOKEN` 参数值。

5. 提交配置并启用服务。

6. 访问微信公众号，开始测试程序。

## 数据库配置说明
数据库中创建了两个数据表，分别为 `system_log` 和 `reply_cache`。

### 在 `system_log` 数据表中，我们定义了以下字段：
```
- `id`：主键，自增长的唯一标识符。

- `level`：日志级别，支持的值包括 'error', 'warn', 'info', 'debug'。

- `message`：日志内容。

- `createdAt`：记录创建时间。

- `updatedAt`：记录更新时间。
```

### 在 `reply_cache` 数据表中，我们定义了以下字段：
```
- `id`：主键，自增长的唯一标识符。

- `msgId`：消息的唯一标识符，在微信公众号中作为消息的身份标识符。

- `responseId`：关联的回答的随机识符。

- `input`：用户的提问内容。

- `reply`：ChatGPT 的回答内容

- `ask` int(11) NOT NULL 微信公众号请求次数。

- `createdAt`：记录创建时间。

- `updatedAt`：记录更新时间。

- `expireAt`：缓存过期时间，用于控制缓存的有效期。
```
在应用程序中，我们使用 `sequelize` 模块来操作缓存，并将缓存保存到了 `reply_cache` 数据表中。

数据库文件位于db\mysql_init.sql
## 编译发布
1. 在项目根目录执行以下命令，打包应用程序。

   ```
   npm run build
   ```

2. 将生成的 `.next` 目录和 `package.json` `.env` `next.config.js` `next-utils.config.js` `next-i18next.config.js` 文件上传到服务器。

   ![发布](./public/images/next.jpg)

3. 在服务器上执行以下命令，安装依赖包。

   ```
   npm install
   ```

4. 在服务器上执行以下命令，启动应用程序。

   ```
   npm start
   ```

5. 在微信公众号管理后台中配置服务器地址，并将 Token 填写为配置文件中的 `TOKEN` 参数值。

6. 提交配置并启用服务。

7. 访问微信公众号，开始使用程序。

8. 有问题可以在[微信公众平台接口调试工具](https://mp.weixin.qq.com/debug)中进行调试

![调试工具](./public/images/wechat_debug.jpg)

# PHP 请求代理程序
如果你的服务器不支持外部接入微信公众号，你可以使用 PHP 请求代理程序，将接收到的请求经过处理后转发到支持接口的 Next.js 应用程序中。

使用方法如下：

1. 复制 `./php/proxy.php` 文件的内容，新建一个 `proxy.php` 文件，并将内容粘贴进去。

2. 将 `'https://*.vercel.app/api/wechat'` 替换为你在上述步骤中部署的 Next.js 应用程序的 URL 地址。

3. 将 `proxy.php` 文件上传到支持 PHP 服务的服务器中，并记住文件所在的 URL 地址。

4. 在微信公众号管理后台中将服务配置为该 PHP 文件的 URL 地址。

如果你使用的是 Vercel，需要注意 Vercel 的函数默认超时时间是 10 秒，而 ChatGPT 处理大量文本时可能会需要更长的时间，因此容易出错。因此，建议在自己的服务器上部署应用程序。

# Vercel Postgres 数据库说明
由于Vercel 不支持sqlite，Vercel提供了基于云的PostgreSQL数据库服务替代方案。

登录后台点击[Storage](https://vercel.com/dashboard/stores)创建Postgres数据库

设置Environment Variables

Vercel Postgres 的链接配置可以在数据库的.env.local选项卡进行查看

本项目的对应设置
```
DB_TYPE=postgres
DB_HOST=POSTGRES_HOST
DB_PORT=5432
DB_USER=POSTGRES_USER
DB_PASS=POSTGRES_PASSWORD
DB_NAME=POSTGRES_DATABASE
```

# 后台管理
后台地址:http://localhost:3000/admin

用户名/密码：admin/admin
# 待解决
认证公众号内容主动发送未测试
安全模式加密回复未解决，目前只支持 兼容模式 、 明文模式