import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/paths", "/learn", "/lab", "/certificates", "/profile", "/admin", "/report"];
const AUTH_PAGES = ["/login", "/signup"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.get("cyh_session")?.value;

  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  if (AUTH_PAGES.includes(pathname) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/paths/:path*", "/learn/:path*", "/lab/:path*", "/certificates/:path*", "/profile/:path*", "/admin/:path*", "/report/:path*", "/login", "/signup"],
};
