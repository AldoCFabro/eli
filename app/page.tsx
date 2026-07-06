import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { requireExistingBusiness } from "@/lib/auth/guard";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const business = await requireExistingBusiness(session);
  redirect(business.onboardingCompleted ? "/dashboard" : "/onboarding");
}
