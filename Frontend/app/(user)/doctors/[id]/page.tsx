import Link from "next/link";
import { notFound } from "next/navigation";
import { doctors } from "@/data/doctors";

type DoctorDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};
export const instant = false;
export default async function DoctorDetailsPage({
  params,
}: DoctorDetailsPageProps) {
  const { id } = await params;

  const doctor = doctors.find((item) => item.id === id);

  if (!doctor) {
    notFound();
  }

  return (
    <>

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
                {doctor.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Doctor profile */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold ${doctor.color}`}
              >
                {doctor.initials}
              </div>

              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold text-blue-600">
                  {doctor.specialty}
                </p>

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {doctor.name}
                </h1>

                <p className="mt-3 text-sm text-gray-600">
                  {doctor.experience} yıl deneyim
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 font-medium text-gray-800">
                    <span className="text-amber-500">★</span>
                    {doctor.rating} / 5
                  </span>

                  <span className="text-gray-500">
                    {doctor.hospital}
                  </span>
                </div>
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

                <p className="mt-4 leading-7 text-gray-600">
                  {doctor.about}
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
                      Tıp Fakültesi
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {doctor.education}
                    </p>
                  </div>
                </div>
              </section>

              {/* Working hours */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Çalışma Saatleri
                </h2>

                <div className="mt-5 divide-y divide-gray-100">
                  {doctor.workingHours.map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between gap-4 py-3 text-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {schedule.day}
                      </span>

                      <span className="text-right text-gray-600">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  Belirtilen saatler örnek amaçlıdır. Gerçek randevu
                  uygunluğu backend bağlantısı yapıldığında kontrol
                  edilecektir.
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
                      {doctor.experience} yıl
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Hastane
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  Konuşulan Diller
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
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

    </>
  );
}
