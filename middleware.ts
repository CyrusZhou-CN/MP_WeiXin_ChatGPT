//middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;
  const locale = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : "cn";

  // If it's the root path, just render it
  if (path === "/") {
    return NextResponse.next();
  }
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("path:", path);
  console.log("req:", req);

  if (!session && /^\/admin(?!\/login)/.test(path)) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  } else if (session && /^\/admin\/?(?:login\/?)?$/.test(path)) {
    return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, req.url));
  }
  return NextResponse.next();
}