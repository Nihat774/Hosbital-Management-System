
"use client";

import { useCallback, useEffect, useState } from "react";

type Patient = {
  id?: number;
  Id?: number;
  fullName?: string;
  FullName?: string;
  age?: number;
  Age?: number;
  gender?: string;
  Gender?: string;
  phone?: string | null;
  Phone?: string | null;
  email?: string | null;
  Email?: string | null;
};

export default function PatientsSection() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/patients", {
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.title || "Hastalar alınamadı."
        );
      }

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPatients();
  }, [fetchPatients]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold">Hastalar</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sisteme kayıtlı hastaları görüntüleyin.
          </p>
        </div>

        <span className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Toplam: {patients.length}
        </span>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            type="button"
            onClick={() => void fetchPatients()}
            className="ml-3 font-semibold underline"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-8 text-center text-gray-500">
          Hastalar yükleniyor...
        </p>
      ) : patients.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          Henüz kayıtlı hasta bulunmuyor.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Yaş</th>
                <th className="px-4 py-3">Cinsiyet</th>
                <th className="px-4 py-3">Telefon</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id ?? patient.Id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-semibold">
                    {patient.fullName ?? patient.FullName ?? "-"}
                  </td>

                  <td className="px-4 py-4 text-gray-500">
                    {patient.email ?? patient.Email ?? "-"}
                  </td>

                  <td className="px-4 py-4">
                    {patient.age ?? patient.Age ?? "-"}
                  </td>

                  <td className="px-4 py-4">
                    {patient.gender ?? patient.Gender ?? "-"}
                  </td>

                  <td className="px-4 py-4">
                    {patient.phone ?? patient.Phone ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
