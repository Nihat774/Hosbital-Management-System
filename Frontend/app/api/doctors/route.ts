
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return forwardRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return forwardRequest(request, "POST");
}

async function forwardRequest(
  request: NextRequest,
  method: "GET" | "POST"
) {
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

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(method === "POST"
          ? { "Content-Type": "application/json" }
          : {}),
      },
      cache: "no-store",
    };

    if (method === "POST") {
      options.body = JSON.stringify(await request.json());
    }

    const response = await fetch(`${apiUrl}/api/Doctors`, options);
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
