import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                H
              </div>

              <span className="text-xl font-bold text-gray-900">
                Medi<span className="text-blue-600">Care</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Sağlığınız için doğru doktoru bulun ve randevunuzu kolayca planlayın.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-gray-900">Geçitler</h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/" className="transition hover:text-blue-600">
                  Ana sayfa
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="transition hover:text-blue-600">
                  Doktorlar
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-blue-600">
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-blue-600">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          {/* For users */}
          <div>
            <h3 className="font-semibold text-gray-900">İstifadəçilər</h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/login" className="transition hover:text-blue-600">
                  Giriş yap
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-blue-600">
                  Kayıt
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="transition hover:text-blue-600"
                >
                  Randevular
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900">Əlaqə</h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li>info@medicare.tr</li>
              <li>+90 550 550 55 55</li>
              <li>Sakarya, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
         
        </div>
      </div>
    </footer>
  );
}