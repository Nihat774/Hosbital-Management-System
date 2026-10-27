
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Oturum bulunamadı. Lütfen giriş yapın." },
            { status: 401 }
        );
    }

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/Patients/my-profile`,
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
}

export async function PUT(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Oturum bulunamadı. Lütfen giriş yapın." },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const response = await fetch(
            `${process.env.API_BASE_URL}/api/Patients/my-profile`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await response.json().catch(() => null);

        return NextResponse.json(
            data ?? {},
            { status: response.status }
        );
    } catch {
        return NextResponse.json(
            { message: "Sunucuya bağlanırken bir hata oluştu." },
            { status: 500 }
        );
    }
}
