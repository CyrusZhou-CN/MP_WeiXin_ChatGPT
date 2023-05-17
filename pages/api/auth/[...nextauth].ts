import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import User from "db/models/user";
import SystemLog from "components/systemLog";
import { NextApiRequest, NextApiResponse } from "next";
import { adapter } from "db/sync-models";

const options: AuthOptions = {  
  adapter,
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, _) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (!process.env.NEXTAUTH_URL && !process.env.VERCEL_URL) {
          console.error("NEXTAUTH_URL or VERCEL_URL is not set");
          throw new Error('NEXTAUTH_URL or VERCEL_URL is not set');
        }
        if (!username || !password) {
          console.error('Missing username or password');
          SystemLog.Log('error', 'Missing username or password');
          throw new Error("Missing username or password");
        }
        try {
          const user = await User.findOne({
            where: {
              username,
            },
          });
          // if user doesn't exist or password doesn't match
          if (!user || !(await compare(password, user.password))) {
            console.error('Invalid username or password');
            SystemLog.Log('error', 'Invalid username or password');
            throw new Error("Invalid username or password");
          }
          console.log(`Successfully logged in as ${username}`);
          SystemLog.Log('info', `Successfully logged in as ${username}`);
          return { id: user.id, name: user.name };
        } catch (error: any) {
          console.error('authorize error:', error);
          SystemLog.Log('error', error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    }
  }, 
  session: {
    strategy: "jwt"
  },
};
const nextAuth = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
export default nextAuth;
