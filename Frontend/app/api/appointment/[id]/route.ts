import { NextRequest, NextResponse } from "next/server";
const apiUrl = process.env.API_BASE_URL;
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Oturum açmanız gerekiyor." },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${apiUrl}/api/Appointments/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                data ?? { message: "Randevu iptal edilemedi." },
                { status: response.status }
            );
        }

        return NextResponse.json(
            data ?? { message: "Randevu başarıyla iptal edildi." }
        );
    } catch {
        return NextResponse.json(
            { message: "Sunucuya bağlanırken bir hata oluştu." },
            { status: 500 }
        );
    }
}