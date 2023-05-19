import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: process.env.NEXTAUTH_SECRET as string,
  cookieName: "mp-weixin-chatgpt-iron-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
