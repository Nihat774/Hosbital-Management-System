import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // 1. Kullanıcının giriş yapıp yapmadığını kontrol et
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    // 2. FormData içerisinden fotoğrafı al
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Fotoğraf seçilmedi." },
        { status: 400 }
      );
    }

    // 3. Dosya türü ve boyutunu kontrol et
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Sadece JPG, PNG ve WebP dosyaları yüklenebilir." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Fotoğraf boyutu en fazla 5 MB olabilir." },
        { status: 400 }
      );
    }

    // 4. Cloudinary bilgilerini al
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary ayarları eksik.");
    }

    // 5. Cloudinary upload parametrelerini hazırla
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "hospital-patients";

    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // 6. Fotoğrafı Cloudinary'ye yükle
    const uploadFormData = new FormData();

    uploadFormData.append("file", file);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("folder", folder);
    uploadFormData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.error?.message || "Fotoğraf yüklenemedi." },
        { status: 500 }
      );
    }

    // 7. Cloudinary URL'sini frontend'e gönder
    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Patient photo upload error:", error);

    return NextResponse.json(
      { message: "Fotoğraf yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}