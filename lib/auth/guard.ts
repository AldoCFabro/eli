import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { Business } from "@/models";
import type { SessionPayload } from "@/types";

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * A JWT can be validly signed and unexpired while pointing at a business
 * that no longer exists (e.g. the DB was reset). Redirecting to /login
 * directly here would leave the stale cookie in place — proxy.ts would keep
 * seeing a "valid" session and bounce every /login request straight back to
 * /dashboard, forever. Routing through the invalidate endpoint clears the
 * cookie first (only allowed from a Route Handler, not a Server Component).
 */
export async function requireExistingBusiness(session: SessionPayload) {
  await connectDB();
  const business = await Business.findById(session.businessId).lean();
  if (!business) redirect("/api/session/invalidate");
  return business;
}

export async function requireOnboardedSession() {
  const session = await requireSession();
  const business = await requireExistingBusiness(session);
  if (!business.onboardingCompleted) redirect("/onboarding");
  return { session, business };
}
