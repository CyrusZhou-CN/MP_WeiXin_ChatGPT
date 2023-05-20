import { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || "f0842d676032c84ceab32453e9eed80c" as string,
  cookieName: "mp-weixin-chatgpt-iron-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
