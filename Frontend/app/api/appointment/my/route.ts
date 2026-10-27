
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const apiUrl = process.env.API_BASE_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { message: "Backend API adresi yapılandırılmamış." },
        { status: 500 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${apiUrl}/api/Appointments/my`,
      {
        method: "GET",
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
