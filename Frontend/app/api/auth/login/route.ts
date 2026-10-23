import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_BASE_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { message: "Backend API adresi yapılandırılmamış." },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/api/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ??
            data?.title ??
            "E-posta veya şifre hatalı.",
        },
        { status: response.status }
      );
    }

    const token =
      typeof data === "string"
        ? data
        : data?.token ?? data?.accessToken ?? data?.jwtToken;

    if (typeof token !== "string" || !token) {
      return NextResponse.json(
        {
          message:
            "Giriş yanıtında JWT bulunamadı. Backend Login yanıtını kontrol etmeliyiz.",
        },
        { status: 502 }
      );
    }

    const result = NextResponse.json({
      message: "Giriş başarılı.",
    });

    result.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return result;
  } catch {
    return NextResponse.json(
      { message: "Backend sunucusuna bağlanılamadı." },
      { status: 502 }
    );
  }
}