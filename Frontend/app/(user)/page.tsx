import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Link from "next/link";

const services = [
  {
    icon: "🩺",
    title: "Doktor Muayenesi",
    description:
      "İhtiyacınıza uygun doktorları bulun ve muayene hakkında bilgi edinin.",
  },
  {
    icon: "🧪",
    title: "Laboratuvar",
    description:
      "Laboratuvar testleri ve tahliller hakkında bilgi edinin.",
  },
  {
    icon: "❤️",
    title: "Kalp Sağlığı",
    description:
      "Kalp sağlığınız için uygun sağlık hizmetlerini keşfedin.",
  },
  {
    icon: "🩻",
    title: "Tanı ve Görüntüleme",
    description:
      "Sağlığınızı değerlendirmek için tanı ve görüntüleme hizmetlerini keşfedin.",
  },
];

function HomePage() {
  return (
    <>

      <main>
        {/* Hero bölməsi */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28 lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Sağlığınız bizim için önemlidir.
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Sağlığınız için
                <span className="block text-blue-600">
                  doğru adres.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                İhtiyaçlarınıza uygun doktorları keşfedin, tıbbi hizmetler hakkında bilgi edinin ve randevunuzu kolayca planlayın.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/doctors"
                  className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Doktorları keşfedin →
                </Link>

                <Link
                  href="/services"
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  Hizmetlerimiz
                </Link>
              </div>
            </div>

            {/* Sağ tərəfdə vizual hissə */}
            <div className="relative">
              <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-900/10 sm:p-8">
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white sm:p-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
                    ✚
                  </div>

                  <h2 className="mt-6 text-3xl font-bold">
                    MediCare
                  </h2>

                  <p className="mt-3 leading-7 text-blue-100">
                    Sağlıklı bir gelecek için doğru adım.
                    Tıbbi hizmetlere kolay erişim.
                  </p>

                  <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-4">
                    <p className="font-semibold">
                      Sağlığınız önceliğimizdir.
                    </p>
                    <p className="mt-1 text-sm text-blue-100">
                      Doktorları keşfedin ve bilgi edinin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-5">
                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-gray-500">
                      Doktor arama
                    </p>
                    <p className="mt-2 font-bold text-gray-900">
                      Kolay ve kullanışlı
                    </p>
                  </div>

                  <div className="rounded-xl bg-sky-50 p-4">
                    <p className="text-sm text-gray-500">
                      Randevu planı
                    </p>
                    <p className="mt-2 font-bold text-gray-900">
                      Bir kaç addımda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Xidmətlər */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Hizmetlerimiz
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sağlığınız için hizmetler
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                İhtiyaçlarınıza uygun tıbbi hizmetleri keşfedin.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition group-hover:bg-blue-100">
                    {service.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {service.description}
                  </p>

                  <Link
                    href="/services"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Daha fazla bilgi →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Randevuya yönləndirmə */}
        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-blue-600 px-8 py-12 sm:px-12 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Sağlığınız için ilk adımı atın.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-blue-100">
                Size uygun doktorları keşfedin ve sağlık hizmetleri hakkında bilgi edinin.
              </p>
            </div>

            <Link
              href="/doctors"
              className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Doktorları keşfedin →
            </Link>
          </div>
        </section>
      </main>

    </>
  );
}

export default HomePage;
