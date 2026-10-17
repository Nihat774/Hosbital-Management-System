
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const services = [
  {
    id: 1,
    title: "Kardiyoloji",
    description:
      "Kalp ve damar sağlığının korunması, kalp hastalıklarının teşhisi ve tedavisi.",
    icon: "❤️",
    features: ["Kalp muayenesi", "EKG", "Kalp sağlığı değerlendirmesi"],
  },
  {
    id: 2,
    title: "Dahiliye",
    description:
      "İç organlarla ilgili hastalıkların değerlendirilmesi ve genel sağlık kontrolleri.",
    icon: "🩺",
    features: ["Genel muayene", "Sağlık kontrolü", "Hastalık değerlendirmesi"],
  },
  {
    id: 3,
    title: "Laboratuvar",
    description:
      "Sağlık durumunun değerlendirilmesine yardımcı olan laboratuvar testleri.",
    icon: "🧪",
    features: ["Kan tahlili", "İdrar tahlili", "Laboratuvar testleri"],
  },
  {
    id: 4,
    title: "Radyoloji",
    description:
      "Tıbbi görüntüleme yöntemleriyle hastalıkların değerlendirilmesine yardımcı olan hizmetler.",
    icon: "🩻",
    features: ["Röntgen", "Ultrasonografi", "Görüntüleme"],
  },
  {
    id: 5,
    title: "Nöroloji",
    description:
      "Beyin, omurilik ve sinir sistemiyle ilgili hastalıkların değerlendirilmesi.",
    icon: "🧠",
    features: ["Nörolojik muayene", "Sinir sistemi değerlendirmesi", "Kontrol muayenesi"],
  },
  {
    id: 6,
    title: "Dermatoloji",
    description:
      "Cilt, saç ve tırnak sağlığıyla ilgili sorunların değerlendirilmesi.",
    icon: "✨",
    features: ["Cilt muayenesi", "Cilt sağlığı", "Dermatolojik değerlendirme"],
  },
  {
    id: 7,
    title: "Göz Hastalıkları",
    description:
      "Görme sağlığının değerlendirilmesi ve göz hastalıklarının teşhisine yönelik muayeneler.",
    icon: "👁️",
    features: ["Göz muayenesi", "Görme kontrolü", "Göz sağlığı değerlendirmesi"],
  },
  {
    id: 8,
    title: "Ortopedi",
    description:
      "Kemik, eklem, kas ve hareket sistemiyle ilgili sağlık sorunlarının değerlendirilmesi.",
    icon: "🦴",
    features: ["Eklem muayenesi", "Hareket sistemi değerlendirmesi", "Ortopedik kontrol"],
  },
];

export default function ServicesPage() {
  return (
    <>

      <main className="min-h-screen bg-white">
        {/* Sayfa başlığı */}
        <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Sağlığınız için yanınızdayız
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Sağlık Hizmetlerimiz
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              İhtiyacınıza uygun sağlık hizmetlerini keşfedin. Uzmanlık
              alanları hakkında bilgi alın ve size uygun doktorları inceleyin.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/doctors"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Doktorları Keşfet →
              </Link>

              <a
                href="#services"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                Hizmetleri İncele
              </a>
            </div>
          </div>
        </section>

        {/* Hizmet kartları */}
        <section
          id="services"
          className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Uzmanlık Alanlarımız
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Size nasıl yardımcı olabiliriz?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Farklı sağlık alanlarına yönelik hizmetlerimizi inceleyin.
              </p>
            </div>

            <span className="text-sm font-medium text-gray-500">
              {services.length} hizmet alanı
            </span>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition group-hover:bg-blue-100">
                    {service.icon}
                  </div>

                  <span className="text-sm font-semibold text-blue-200">
                    {String(service.id).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-3 min-h-14 text-sm leading-7 text-gray-600">
                  {service.description}
                </p>

                <div className="mt-5 border-t border-gray-100 pt-5">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Hizmet kapsamı
                  </h4>

                  <ul className="mt-3 space-y-3">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="mt-0.5 font-bold text-blue-600">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href="/doctors"
                    className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Doktorları İncele
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Alt çağrı alanı */}
        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl bg-blue-600 px-8 py-12 sm:px-12 sm:py-14">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Size uygun doktoru bulun
                </h2>

                <p className="mt-4 leading-7 text-blue-100">
                  Uzmanlık alanlarını inceleyin ve ihtiyacınıza uygun doktorları keşfedin.
                </p>
              </div>

              <Link
                href="/doctors"
                className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Doktorlara Git →
              </Link>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
