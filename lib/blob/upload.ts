import "server-only";
import { put } from "@vercel/blob";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

export class ImageValidationError extends Error {}

export async function uploadImage(file: File, keyPrefix: string) {
  if (!(file instanceof File) || file.size === 0) {
    throw new ImageValidationError("No se recibió ningún archivo.");
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new ImageValidationError("Formato de imagen no permitido. Usá PNG, JPG o WEBP.");
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new ImageValidationError("La imagen no puede superar los 3MB.");
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Falta la variable de entorno BLOB_READ_WRITE_TOKEN.");
  }

  const blob = await put(`${keyPrefix}.${extension}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return blob.url;
}
