
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const apiUrl = process.env.API_BASE_URL;

  if (!token) {
    return NextResponse.json(
      { message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." },
      { status: 401 }
    );
  }

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API_BASE_URL tanımlanmamış." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/Appointments/doctor/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Backend sunucusuna bağlanılamadı." },
      { status: 502 }
    );
  }
}
