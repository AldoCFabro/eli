"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Business, User } from "@/models";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { serializeFormInput, zodErrorState, type FormState } from "@/lib/action-state";

const SENSITIVE_FIELDS = ["password", "confirmPassword"];

export async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const rawInput = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const key = rateLimitKey(await headers(), "register");
  const limited = checkRateLimit(key, 5, 10 * 60 * 1000);
  if (!limited.success) {
    return { error: "Demasiados intentos. Probá de nuevo en unos minutos.", values: serializeFormInput(rawInput, SENSITIVE_FIELDS) };
  }

  const parsed = registerSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput, SENSITIVE_FIELDS);

  await connectDB();

  const existing = await User.findOne({ email: parsed.data.email }).lean();
  if (existing) {
    return {
      fieldErrors: { email: ["Ya existe una cuenta con ese email."] },
      values: serializeFormInput(rawInput, SENSITIVE_FIELDS),
    };
  }

  const business = await Business.create({
    name: "Mi negocio",
    type: "otro",
    onboardingCompleted: false,
  });

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await User.create({
    email: parsed.data.email,
    passwordHash,
    businessId: business._id,
    role: "owner",
  });

  await createSession({
    userId: user._id.toString(),
    businessId: business._id.toString(),
    role: "owner",
    email: user.email,
  });

  redirect("/onboarding");
}

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const rawInput = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const key = rateLimitKey(await headers(), "login");
  const limited = checkRateLimit(key, 8, 10 * 60 * 1000);
  if (!limited.success) {
    return { error: "Demasiados intentos. Probá de nuevo en unos minutos.", values: serializeFormInput(rawInput, SENSITIVE_FIELDS) };
  }

  const parsed = loginSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput, SENSITIVE_FIELDS);

  await connectDB();

  const values = serializeFormInput(rawInput, SENSITIVE_FIELDS);

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return { error: "Email o contraseña incorrectos.", values };

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) return { error: "Email o contraseña incorrectos.", values };

  const business = await Business.findById(user.businessId).lean();

  await createSession({
    userId: user._id.toString(),
    businessId: user.businessId.toString(),
    role: user.role as "owner" | "admin",
    email: user.email,
  });

  redirect(business?.onboardingCompleted ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
