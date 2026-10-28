import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Oturum bulunamadı. Lütfen giriş yapın." },
            { status: 401 }
        );
    }

    try {
        const formData = await request.formData();
        const photo = formData.get("photo");

        if (!(photo instanceof File)) {
            return NextResponse.json(
                { message: "Lütfen bir fotoğraf seçin." },
                { status: 400 }
            );
        }

        const backendFormData = new FormData();
        backendFormData.append("photo", photo);

        const response = await fetch(
            `${process.env.API_BASE_URL}/api/Patients/my-profile/photo`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: backendFormData,
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
            { message: "Fotoğraf yüklenirken bir hata oluştu." },
            { status: 500 }
        );
    }
}