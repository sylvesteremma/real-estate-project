import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const maxFileSize = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "An image file is required" },
      { status: 400 },
    );
  }
  if (
    !allowedTypes.has(file.type) ||
    file.size > maxFileSize ||
    file.size === 0
  ) {
    return NextResponse.json(
      { error: "Use a non-empty JPEG, PNG, or WebP image under 8 MB" },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const encodedFile = `data:${file.type};base64,${bytes.toString("base64")}`;
  const image = await uploadImageToCloudinary(
    encodedFile,
    "benny-homes/properties",
  );

  return NextResponse.json({ image }, { status: 201 });
}
