
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  return forwardRequest(request, await params, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  return forwardRequest(request, await params, "DELETE");
}

async function forwardRequest(
  request: NextRequest,
  params: { id: string },
  method: "PUT" | "DELETE"
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const apiUrl = process.env.API_BASE_URL;
    const id = Number(params.id);

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

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "Geçersiz doktor numarası." },
        { status: 400 }
      );
    }

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
      options.body = JSON.stringify(await request.json());
    }

    const response = await fetch(
      `${apiUrl}/api/Doctors/${id}`,
      options
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
