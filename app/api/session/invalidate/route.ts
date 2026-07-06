import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

/**
 * Cookies can only be mutated from a Server Action or Route Handler, never
 * from a plain Server Component render — so pages/layouts that discover a
 * stale session (valid JWT, but the business/user it points to is gone)
 * redirect here instead of clearing the cookie themselves.
 */
export async function GET(request: Request) {
  await destroySession();
  return NextResponse.redirect(new URL("/login", request.url));
}
