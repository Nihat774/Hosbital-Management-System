
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

type PatientForm = {
  fullName: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  phone: string;
};

const emptyForm: PatientForm = {
  fullName: "",
  email: "",
  password: "",
  age: "",
  gender: "",
  phone: "",
};

export default function PatientSection() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PatientForm>(emptyForm);

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

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(patient: Patient) {
    const id = patient.id ?? patient.Id;

    if (id == null) {
      setError("Hasta ID bilgisi bulunamadı.");
      return;
    }

    setEditingId(id);
    setForm({
      fullName: patient.fullName ?? patient.FullName ?? "",
      email: patient.email ?? patient.Email ?? "",
      password: "",
      age: String(patient.age ?? patient.Age ?? ""),
      gender: patient.gender ?? patient.Gender ?? "",
      phone: patient.phone ?? patient.Phone ?? "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing = editingId !== null;

      const body = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone.trim() || null,
        ...(!isEditing ? { password: form.password } : {}),
      };

      const response = await fetch(
        isEditing ? `/api/patients/${editingId}` : "/api/patients",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.title ||
            (isEditing
              ? "Hasta güncellenemedi."
              : "Hasta oluşturulamadı.")
        );
      }

      setSuccess(
        isEditing
          ? "Hasta bilgileri güncellendi."
          : "Yeni hasta başarıyla eklendi."
      );
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await fetchPatients();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(patient: Patient) {
    const id = patient.id ?? patient.Id;

    if (id == null) {
      setError("Hasta ID bilgisi bulunamadı.");
      return;
    }

    const name = patient.fullName ?? patient.FullName ?? "Bu hasta";

    if (
      !window.confirm(
        `${name} adlı hastayı silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Hasta silinemedi.");
      }

      setSuccess("Hasta başarıyla silindi.");
      await fetchPatients();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bir hata oluştu."
      );
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold">Hastalar</h3>
          <p className="mt-1 text-sm text-gray-500">
            Hastaları görüntüleyin, ekleyin ve bilgilerini yönetin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Toplam: {patients.length}
          </span>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Yeni Hasta
          </button>
        </div>
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

      {success && (
        <div className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5"
        >
          <h4 className="mb-5 text-lg font-bold">
            {editingId !== null ? "Hasta Bilgilerini Düzenle" : "Yeni Hasta Ekle"}
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Ad Soyad
              </label>
              <input
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Ad Soyad"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                E-posta
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                placeholder="ornek@mail.com"
              />
            </div>

            {editingId === null && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Şifre
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="En az 6 karakter"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Yaş
              </label>
              <input
                required
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Yaş"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Cinsiyet
              </label>
              <select
                required
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">Seçiniz</option>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Telefon
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                placeholder="05xx xxx xx xx"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Kaydediliyor..."
                : editingId !== null
                  ? "Değişiklikleri Kaydet"
                  : "Hastayı Oluştur"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
                setEditingId(null);
                setError("");
              }}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              İptal
            </button>
          </div>
        </form>
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
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Yaş</th>
                <th className="px-4 py-3">Cinsiyet</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">İşlemler</th>
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
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(patient)}
                        className="rounded-md bg-amber-50 px-3 py-1.5 font-medium text-amber-700 hover:bg-amber-100"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(patient)}
                        className="rounded-md bg-red-50 px-3 py-1.5 font-medium text-red-700 hover:bg-red-100"
                      >
                        Sil
                      </button>
                    </div>
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
