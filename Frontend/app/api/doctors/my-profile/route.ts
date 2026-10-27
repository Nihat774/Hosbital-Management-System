
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

async function proxyRequest(
  request: NextRequest,
  method: "GET" | "PUT"
) {
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
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(method === "PUT"
          ? { "Content-Type": "application/json" }
          : {}),
      },
      cache: "no-store",
    };

    if (method === "PUT") {
      options.body = await request.text();
    }

    const response = await fetch(
      `${apiUrl}/api/Doctors/my-profile`,
      options
    );

    const text = await response.text();

    return new NextResponse(text || null, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ||
          "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Backend sunucusuna bağlanılamadı." },
      { status: 502 }
    );
  }
}
