
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await getApiContext(request);

    if ("error" in context) return context.error;

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(
      `${context.apiUrl}/api/Patients/${id}`,
      {
        method: "PUT",
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
      { message: "Hasta güncellenirken bir hata oluştu." },
      { status: 502 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await getApiContext(request);

    if ("error" in context) return context.error;

    const { id } = await params;

    const response = await fetch(
      `${context.apiUrl}/api/Patients/${id}`,
      {
        method: "DELETE",
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
      { message: "Hasta silinirken bir hata oluştu." },
      { status: 502 }
    );
  }
}
