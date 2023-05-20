import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../db/models";
import { compare } from "bcrypt";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body

  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    console.log('username:', username);
    console.log('password:', password);
    if (user && await compare(password, user.password)) {
      const sessionUser = { id: user?.id, name: user?.name, isLoggedIn: true, image: user?.image, };
      req.session.user = sessionUser;
      await req.session.save();
      res.json(sessionUser)
    } else {
      res.status(403).json({ message: "Invalid username or password" })
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}