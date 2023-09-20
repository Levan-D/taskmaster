/** @format */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"

export function middleware(request: NextRequest) {
  // if (request.nextUrl.pathname.startsWith("/")) {
  //   console.log(request.cookies.get("user_time")?.value)
  // }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // @ts-ignore
    authMiddleware(request)
  }
}
