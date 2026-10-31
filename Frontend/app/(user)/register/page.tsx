
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setError("Yaş 1 ile 120 arasında olmalıdır.");
      return;
    }

    if (!gender) {
      setError("Lütfen cinsiyet seçiniz.");
      return;
    }

    if (!termsAccepted) {
      setError("Devam etmek için kullanım koşullarını kabul etmelisiniz.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            phone,
            age: parsedAge,
            gender,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : typeof data === "string"
              ? data
              : "Kayıt işlemi başarısız oldu.";

        throw new Error(message);
      }

      setSuccess(
        "Hesabınız oluşturuldu! E-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin."
      );
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Backend sunucusuna bağlanılamadı. API adresini ve backend sunucusunu kontrol edin."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Beklenmeyen bir hata oluştu."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              H
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Hesap Oluştur
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              MediCare ailesine katılmak için bilgilerinizi girin.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Ad Soyad
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Adınızı ve soyadınızı girin"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Telefon Numarası
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Yaş
              </label>

              <input
                id="age"
                name="age"
                type="number"
                placeholder="Yaşınızı girin"
                min={1}
                max={120}
                step={1}
                value={age}
                onChange={(event) => setAge(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Cinsiyet
              </label>

              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">Cinsiyet seçiniz</option>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Şifre
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 8 karakter"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Şifre Tekrarı
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showConfirmPassword ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
              <input
                type="checkbox"
                name="terms"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600"
              />

              <span>
                Kullanım koşullarını ve gizlilik politikasını okudum,
                kabul ediyorum.
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl bg-green-50 p-3 text-sm text-green-700"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
