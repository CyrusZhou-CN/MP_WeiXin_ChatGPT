declare global {
  interface SessionUser {
    isLoggedIn: boolean;
    name: string | undefined | null;
    image: string | undefined | null;
  }
}
import "iron-session";
declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}
