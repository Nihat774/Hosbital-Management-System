"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex h-screen items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-lg text-center">
                <h1 className="text-8xl font-extrabold tracking-tight text-blue-600">
                    404
                </h1>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    Sayfa Bulunamadı
                </h2>

                <p className="mt-3 text-base leading-7 text-gray-500">
                    Aradığınız sayfa mevcut değil, taşınmış veya kaldırılmış olabilir.
                    Lütfen adresi kontrol edin.
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Ana Sayfaya Dön
                </Link>
            </div>
        </main>
    );
}