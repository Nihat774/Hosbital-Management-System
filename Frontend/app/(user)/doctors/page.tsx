import Link from "next/link";
export const instant = false;
type Doctor = {
  id: number;
  fullName: string;
  gender: string;
  specialty: string;
  experienceYears: number;
  photoUrl: string | null;
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

export default async function DoctorsPage() {
  let doctors: Doctor[] = [];
  let error = false;

  try {
    const apiUrl = process.env.API_BASE_URL;

    if (!apiUrl) {
      throw new Error("API_BASE_URL tanımlanmamış.");
    }

    const response = await fetch(`${apiUrl}/api/Doctors`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Doktorlar alınamadı.");
    }

    doctors = await response.json();
  } catch (err) {
    console.error("Doktor listesi alınamadı:", err);
    error = true;
  }


  console.log(doctors);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
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

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Tüm Doktorlar
            </h2>

            <p className="text-sm text-gray-500">
              Toplam {doctors.length} doktor listeleniyor
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              Doktorlar yüklenemedi. Backend'in çalıştığını ve API
              adresini kontrol edin.
            </div>
          ) : doctors.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
              Henüz kayıtlı doktor bulunmuyor.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <article
                  key={doctor.id}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="flex items-start justify-between">
                    {/* <div
                      className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold ${
                        colors[(doctor.id - 1) % colors.length]
                      }`}
                    >
                      {getInitials(doctor.fullName)}
                    </div> */}
                    <div className="flex size-[100px] items-center border justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
                      <img
                        src={doctor?.photoUrl || "/images/user-icon.avif"}
                        alt="Profil fotoğrafı"
                        className="h-full w-full border rounded-2xl object-cover"
                      />
                    </div>

                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                      <span>★ </span>
                      4.7
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    {doctor.fullName}
                  </h3>

                  <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    {doctor.specialty}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-blue-600">●</span>
                    {doctor.experienceYears} yıl deneyim
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
          )}
        </section>
      </main>
    </>
  );
}
