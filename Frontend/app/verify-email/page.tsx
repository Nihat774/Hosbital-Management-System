
"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState(
    "E-posta adresiniz doğrulanıyor..."
  );
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyEmail() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const email = params.get("email");

      if (!token || !email) {
        setMessage("Doğrulama bağlantısı geçersiz.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/verify-email?${params.toString()}`
        );

        const data = await response.json();

        setMessage(
          data.message ?? "Doğrulama işlemi tamamlanamadı."
        );
        setSuccess(response.ok);
      } catch {
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    }

    verifyEmail();
  }, []);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          E-posta Doğrulama
        </h1>

        <p
          className={
            loading
              ? "text-gray-600"
              : success
                ? "text-green-600"
                : "text-red-600"
          }
        >
          {message}
        </p>

        {!loading && success && (
          <a
            href="/login"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Giriş Yap
          </a>
        )}
      </div>
    </main>
  );
}
