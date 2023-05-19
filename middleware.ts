//middleware.ts

import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "./lib/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;
  const locale = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : "cn";
  const res = NextResponse.next();
  if (path === "/") {
    return res;
  }
  const session = await getIronSession(req, res, sessionOptions);
  const { user } = session;
  console.log('path:',path);
  console.log('session:',session);
  if (!user?.isLoggedIn && /^\/admin(?!\/login)/.test(path)) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
  } else if (user?.isLoggedIn  && /^\/admin\/?(?:login\/?)?$/.test(path)) {
    return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, req.url));
  }
  return res;
}