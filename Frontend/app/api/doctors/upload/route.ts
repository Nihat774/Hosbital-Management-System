
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Cloudinary yapılandırması eksik." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Lütfen bir fotoğraf seçin." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Yalnızca JPG, PNG veya WebP yükleyebilirsiniz." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Fotoğraf boyutu en fazla 5 MB olabilir." },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "hospital-doctors";

    const signatureString =
      `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature = createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("folder", folder);
    uploadData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
  console.error("Cloudinary hata yanıtı:", result);

  return NextResponse.json(
    {
      message:
        result?.error?.message ||
        "Fotoğraf Cloudinary'ye yüklenemedi.",
    },
    { status: 502 }
  );
}

    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
  console.error("Cloudinary upload hatası:", error);

  return NextResponse.json(
    {
      message:
        error instanceof Error
          ? error.message
          : "Bilinmeyen bir hata oluştu.",
    },
    { status: 500 }
  );
  }
}
