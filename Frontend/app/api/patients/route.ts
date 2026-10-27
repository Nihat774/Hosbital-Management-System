
import { NextRequest, NextResponse } from "next/server";

async function getApiContext(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const apiUrl = process.env.API_BASE_URL;

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." },
        { status: 401 }
      ),
    };
  }

  if (!apiUrl) {
    return {
      error: NextResponse.json(
        { message: "Backend API adresi yapılandırılmamış." },
        { status: 500 }
      ),
    };
  }

  return { token, apiUrl };
}

export async function GET(request: NextRequest) {
  try {
    const context = await getApiContext(request);

    if ("error" in context) return context.error;

    const response = await fetch(
      `${context.apiUrl}/api/Patients`,
      {
        headers: {
          Authorization: `Bearer ${context.token}`,
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
      { message: "Backend sunucusuna ulaşılamadı." },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getApiContext(request);

    if ("error" in context) return context.error;

    const body = await request.json();

    const response = await fetch(
      `${context.apiUrl}/api/Patients`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${context.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Hasta oluşturulurken bir hata oluştu." },
      { status: 502 }
    );
  }
}
