
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "auth_token çerezi bulunamadı. Yeniden giriş yap." },
      { status: 401 }
    );
  }

  const apiUrl = process.env.API_BASE_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API_BASE_URL tanımlanmamış." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/Appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    console.log("Appointments backend status:", response.status);
    console.log("Appointments backend response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText || "Backend boş yanıt döndürdü." };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Appointments fetch error:", error);

    return NextResponse.json(
      { message: "Backend'e bağlanılamadı. API_BASE_URL adresini kontrol et." },
      { status: 500 }
    );
  }
}
