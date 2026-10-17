
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { doctors } from "@/data/doctors";



export default function DoctorsPage() {
  return (
    <>

      <main className="min-h-screen bg-gray-50">
        {/* Sayfa başlığı */}
        <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Uzman kadromuz
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Doktorlarımız
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
              İhtiyacınıza uygun uzmanı keşfedin ve sağlık yolculuğunuz
              için ilk adımı atın.
            </p>
          </div>
        </section>

        {/* Doktor listesi */}
        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Tüm Doktorlar
            </h2>

            <p className="text-sm text-gray-500">
              Toplam {doctors.length} doktor listeleniyor
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                {/* Doktor görseli yerine şimdilik baş harfler */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold ${doctor.color}`}
                  >
                    {doctor.initials}
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                    <span>★</span>
                    {doctor.rating}
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {doctor.name}
                </h3>

                <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {doctor.specialty}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-blue-600">●</span>
                  {doctor.experience} yıl deneyim
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Doktoru İncele
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
