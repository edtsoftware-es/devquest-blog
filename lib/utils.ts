import { type ClassValue, clsx } from "clsx";
import { formatDate as formatDateFns } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

const DEFAULT_QUALITY = 0.8;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function convertFileToWebp(
  file: File,
  options?: { quality?: number }
): Promise<Blob> {
  const quality = options?.quality ?? DEFAULT_QUALITY;
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to obtain canvas context");
    }

    ctx.drawImage(img, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert image to webp"));
          }
        },
        "image/webp",
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error("Error al cargar la imagen"));
  });

  return image;
}

export function formatDate(timestamp?: number) {
  if (!timestamp) {
    return "";
  }
  return formatDateFns(timestamp, "MMM dd, yyyy", {
    locale: es,
  });
}
