
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { message: "Doğrulama bağlantısı geçersiz." },
      { status: 400 }
    );
  }

  try {
    const backendUrl =
      process.env.API_BASE_URL ?? "http://localhost:5041";

    const query = new URLSearchParams({ token, email });

    const response = await fetch(
      `${backendUrl}/api/Auth/verify-email?${query.toString()}`,
      { cache: "no-store" }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
