"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Business } from "@/models";
import { businessProfileSchema } from "@/lib/validations/business";
import { uploadImage, ImageValidationError } from "@/lib/blob/upload";
import { serializeFormInput, zodErrorState, type FormState } from "@/lib/action-state";

export async function completeOnboardingAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();

  const rawInput = {
    name: formData.get("name"),
    type: formData.get("type"),
    brandPrimaryColor: formData.get("brandPrimaryColor"),
    brandSecondaryColor: formData.get("brandSecondaryColor"),
    phone: formData.get("phone") ?? "",
    address: formData.get("address") ?? "",
  };

  const parsed = businessProfileSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();

  const update: Record<string, unknown> = { ...parsed.data, onboardingCompleted: true };

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      update.logoUrl = await uploadImage(logo, `businesses/${session.businessId}/logo`);
    } catch (err) {
      const values = serializeFormInput(rawInput);
      if (err instanceof ImageValidationError) {
        return { fieldErrors: { logo: [err.message] }, values };
      }
      return { error: "No pudimos subir el logo. Probá de nuevo.", values };
    }
  }

  await Business.findByIdAndUpdate(session.businessId, update);

  redirect("/dashboard");
}
