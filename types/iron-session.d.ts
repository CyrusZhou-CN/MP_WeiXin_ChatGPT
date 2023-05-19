declare global {
  export type SessionUser = {
    isLoggedIn: boolean;
    name: string | undefined | null;
    image: string | undefined | null;
  };
}

declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}