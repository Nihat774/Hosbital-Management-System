
"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
            {/* Başlık */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                H
              </div>

              <h1 className="mt-5 text-2xl font-bold text-gray-900">
                Tekrar Hoş Geldiniz
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Hesabınıza giriş yapmak için bilgilerinizi girin.
              </p>
            </div>

            {/* Giriş formu */}
            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  E-posta Adresi
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Şifre
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrenizi girin"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Gizle" : "Göster"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Giriş Yap
              </button>
            </form>

            {/* Kayıt bağlantısı */}
            <p className="mt-7 text-center text-sm text-gray-600">
              Henüz hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Kayıt Ol
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs leading-6 text-gray-400">
            MediCare ile sağlık hizmetlerine daha kolay ulaşın.
          </p>
        </div>
      </main>

    </>
  );
}
