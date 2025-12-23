import { NextResponse } from "next/server";

async function isAuthed(req, token) {
  const res = await fetch(new URL("/api/auth/me", req.url), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.ok;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");

  if (!token) {
    if (isDashboardPage) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  let authed = false;
  try {
    authed = await isAuthed(req, token);
  } catch {
    authed = false;
  }

  if (authed) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (isDashboardPage) {
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.set("token", "", { path: "/", maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
};
