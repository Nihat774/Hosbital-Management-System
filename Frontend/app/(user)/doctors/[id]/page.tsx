
import Link from "next/link";
import { notFound } from "next/navigation";
export const instant = false;
type Doctor = {
  id: number;
  fullName: string;
  gender: string;
  phone: string | null;
  photoUrl: string | null;
  email: string;
  specialty: string;
  experienceYears: number;
  university: string;
  about: string | null;
  languages: string | null;
};

type DoctorDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
];

function getInitials(fullName: string) {
  const name = fullName.replace(/^Dr\.?\s*/i, "").trim();

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
}

export default async function DoctorDetailsPage({
  params,
}: DoctorDetailsPageProps) {
  const { id } = await params;
  const doctorId = Number(id);

  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    notFound();
  }

  let doctor: Doctor;

  try {
    const apiUrl = process.env.API_BASE_URL;

    if (!apiUrl) {
      throw new Error("API_BASE_URL tanımlanmamış.");
    }

    const response = await fetch(
      `${apiUrl}/api/Doctors/${doctorId}`,
      { cache: "no-store" }
    );

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error("Doktor bilgileri alınamadı.");
    }

    doctor = await response.json();
  } catch (error) {
    console.error("Doktor detayları alınamadı:", error);

    throw new Error(
      "Doktor bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin."
    );
  }

  const initials = getInitials(doctor.fullName);
  const color = colors[(doctor.id - 1) % colors.length];

  const languages =
    doctor.languages
      ?.split(",")
      .map((language) => language.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 transition hover:text-blue-600"
            >
              Ana Sayfa
            </Link>

            <span className="text-gray-400">/</span>

            <Link
              href="/doctors"
              className="text-gray-500 transition hover:text-blue-600"
            >
              Doktorlarımız
            </Link>

            <span className="text-gray-400">/</span>

            <span className="font-medium text-gray-900">
              {doctor.fullName}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Doctor profile */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className={`flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-3xl font-bold ${color}`}
            >
              {doctor.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doctor.photoUrl}
                  alt={doctor.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="flex-1">
              <p className="mb-2 text-sm font-semibold text-blue-600">
                {doctor.specialty}
              </p>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {doctor.fullName}
              </h1>

              <p className="mt-3 text-sm text-gray-600">
                {doctor.experienceYears} yıl deneyim
              </p>

              <p className="mt-3 text-sm text-gray-500">
                {doctor.university}
              </p>
            </div>

            <Link
              href={`/appointments?doctor=${doctor.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Randevu Al
            </Link>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Hakkında
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                {doctor.about || "Henüz açıklama eklenmemiş."}
              </p>
            </section>

            {/* Education */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Eğitim Bilgileri
              </h2>

              <div className="mt-5 flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <span className="text-xl">🎓</span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Üniversite
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {doctor.university}
                  </p>
                </div>
              </div>
            </section>

            {/* Working hours */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Çalışma Saatleri
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Doktorun çalışma saatleri henüz sisteme eklenmemiştir.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Doktor Bilgileri
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Uzmanlık Alanı
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {doctor.specialty}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Deneyim
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {doctor.experienceYears} yıl
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Üniversite</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {doctor.university}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Konuşulan Diller
              </h2>

              {languages.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Dil bilgisi henüz eklenmemiş.
                </p>
              )}
            </section>

            <div className="rounded-2xl bg-blue-600 p-6 text-white">
              <h2 className="text-lg font-bold">
                Sağlığınız için ilk adımı atın
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Doktorunuzla görüşmek için randevu sayfasına
                geçebilirsiniz.
              </p>

              <Link
                href={`/appointments?doctor=${doctor.id}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Randevu Oluştur
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-8">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            <span>←</span>
            Tüm Hekimlere Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
