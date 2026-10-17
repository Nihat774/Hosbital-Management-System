
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const values = [
  {
    id: 1,
    icon: "❤️",
    title: "Hasta Odaklılık",
    description:
      "Kullanıcıların sağlık hizmetlerine kolayca ulaşabilmesini ve ihtiyaçlarına uygun bilgileri bulabilmesini önemsiyoruz.",
  },
  {
    id: 2,
    icon: "🤝",
    title: "Güven ve Şeffaflık",
    description:
      "Sağlık hizmetleri hakkında açık, anlaşılır ve güvenilir bilgi sunmayı hedefliyoruz.",
  },
  {
    id: 3,
    icon: "💡",
    title: "Yenilikçilik",
    description:
      "Teknolojiyi kullanarak sağlık hizmetlerine erişim süreçlerini daha kolay hale getirmeyi amaçlıyoruz.",
  },
  {
    id: 4,
    icon: "🌿",
    title: "Sürekli Gelişim",
    description:
      "Kullanıcı deneyimini iyileştirmek ve hizmet kalitesini geliştirmek için çalışıyoruz.",
  },
];

const goals = [
  {
    id: 1,
    number: "01",
    title: "Misyonumuz",
    description:
      "İnsanların sağlık hizmetleri hakkında bilgi edinmesini, uygun uzmanları keşfetmesini ve sağlık süreçlerini daha kolay yönetmesini sağlayan erişilebilir bir platform sunmak.",
  },
  {
    id: 2,
    number: "02",
    title: "Vizyonumuz",
    description:
      "Teknoloji ve kullanıcı odaklı tasarımı bir araya getirerek sağlık hizmetlerine erişimi daha anlaşılır, düzenli ve kolay hale getiren bir platform olmak.",
  },
];

export default function AboutPage() {
  return (
    <>

      <main className="bg-white">
        {/* Sayfa başlığı */}
        <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              MediCare hakkında
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Sağlık hizmetlerine
              <span className="block text-blue-600">
                daha kolay erişim.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              MediCare, kullanıcıların sağlık hizmetlerini keşfetmesini,
              doktorlar hakkında bilgi edinmesini ve ihtiyaçlarına uygun
              seçenekleri daha kolay bulmasını amaçlayan bir platformdur.
            </p>
          </div>
        </section>

        {/* Hakkımızda içerik */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Biz kimiz?
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Sağlık yolculuğunuzda size eşlik ediyoruz.
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Sağlık hizmetlerine ulaşmanın daha kolay ve anlaşılır olması
              gerektiğine inanıyoruz. Bu doğrultuda MediCare, kullanıcıların
              sağlık alanlarını inceleyebileceği ve kendilerine uygun
              doktorları keşfedebileceği bir deneyim sunmak üzere tasarlanmıştır.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Amacımız, kullanıcıların ihtiyaç duydukları bilgilere
              düzenli bir şekilde ulaşabilmelerine yardımcı olmak ve
              dijital sağlık deneyimini daha kullanışlı hale getirmektir.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Hizmetlerimizi Keşfet
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Görsel yerine tasarımla oluşturulan alan */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-blue-100 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-sky-100 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white sm:p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
                  ✚
                </div>

                <h3 className="mt-7 text-2xl font-bold sm:text-3xl">
                  İnsan odaklı teknoloji
                </h3>

                <p className="mt-4 leading-7 text-blue-100">
                  Sağlık hizmetlerine erişimi kolaylaştıran,
                  anlaşılır ve kullanıcı dostu bir dijital deneyim.
                </p>

                <div className="mt-8 h-1.5 w-24 rounded-full bg-white/80" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-100 bg-white p-4">
                  <span className="text-2xl">🩺</span>
                  <p className="mt-3 font-semibold text-gray-900">
                    Sağlık odaklı
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Kullanıcı ihtiyaçları
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-4">
                  <span className="text-2xl">💻</span>
                  <p className="mt-3 font-semibold text-gray-900">
                    Dijital deneyim
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Kolay erişim
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misyon ve vizyon */}
        <section className="border-y border-gray-100 bg-gray-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Hedeflerimiz
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Misyonumuz ve vizyonumuz
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Sağlık alanında daha erişilebilir ve kullanıcı dostu
                bir dijital deneyim oluşturmak için çalışıyoruz.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {goals.map((goal) => (
                <article
                  key={goal.id}
                  className="rounded-2xl border border-gray-200 bg-white p-7 sm:p-9"
                >
                  <span className="text-sm font-bold tracking-widest text-blue-600">
                    {goal.number}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold text-gray-900">
                    {goal.title}
                  </h3>

                  <p className="mt-4 leading-8 text-gray-600">
                    {goal.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Temel değerler */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Temel değerlerimiz
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Bizi yönlendiren değerler
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Tasarımımızı ve hizmet yaklaşımımızı şekillendiren
              temel ilkelerimiz.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {value.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Alt yönlendirme */}
        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl bg-blue-600 px-8 py-12 sm:px-12 sm:py-14">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Size uygun doktoru keşfedin
                </h2>

                <p className="mt-4 leading-7 text-blue-100">
                  Uzmanlık alanlarını inceleyin ve sağlık ihtiyaçlarınıza
                  uygun doktorları bulun.
                </p>
              </div>

              <Link
                href="/doctors"
                className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Doktorları İncele →
              </Link>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
