
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const apiUrl = process.env.API_BASE_URL;
    const { id } = await params;

    if (!token) {
      return NextResponse.json(
        { message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." },
        { status: 401 }
      );
    }

    if (!apiUrl) {
      return NextResponse.json(
        { message: "Backend API adresi yapılandırılmamış." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${apiUrl}/api/Staff/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Personel güncellenirken bir hata oluştu." },
      { status: 502 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const apiUrl = process.env.API_BASE_URL;
    const { id } = await params;

    if (!token) {
      return NextResponse.json(
        { message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." },
        { status: 401 }
      );
    }

    if (!apiUrl) {
      return NextResponse.json(
        { message: "Backend API adresi yapılandırılmamış." },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/api/Staff/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Personel silinirken bir hata oluştu." },
      { status: 502 }
    );
  }
}
