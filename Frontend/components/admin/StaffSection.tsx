
"use client";

import { useCallback, useEffect, useState } from "react";

type Staff = {
  id?: number;
  Id?: number;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  phone?: string | null;
  Phone?: string | null;
  gender?: string;
  Gender?: string;
  jobtitle?: string | null;
  Jobtitle?: string | null;
};

type StaffForm = {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  jobtitle: string;
};

const initialForm: StaffForm = {
  fullName: "",
  email: "",
  password: "",
  gender: "Erkek",
  phone: "",
  jobtitle: "",
};

export default function StaffSection() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<StaffForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/staff", {
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.title || "Personeller alınamadı."
        );
      }

      setStaffList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStaff();
  }, [fetchStaff]);

  function updateField(field: keyof StaffForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function openCreateForm() {
    setEditingStaff(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleEdit(staff: Staff) {
    setEditingStaff(staff);
    setForm({
      fullName: staff.fullName ?? staff.FullName ?? "",
      email: staff.email ?? staff.Email ?? "",
      password: "",
      gender: staff.gender ?? staff.Gender ?? "Erkek",
      phone: staff.phone ?? staff.Phone ?? "",
      jobtitle: staff.jobtitle ?? staff.Jobtitle ?? "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const id = editingStaff
        ? editingStaff.id ?? editingStaff.Id
        : undefined;

      if (editingStaff && id == null) {
        throw new Error("Personel numarası bulunamadı.");
      }

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        gender: form.gender,
        phone: form.phone.trim() || null,
        jobtitle: form.jobtitle.trim() || null,
        ...(!editingStaff ? { password: form.password } : {}),
      };

      const response = await fetch(
        editingStaff ? `/api/staff/${id}` : "/api/staff",
        {
          method: editingStaff ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.title || "Personel kaydedilemedi."
        );
      }

      setSuccess(
        data?.message ||
          (editingStaff
            ? "Personel bilgileri güncellendi."
            : "Personel başarıyla eklendi.")
      );

      setForm(initialForm);
      setEditingStaff(null);
      setShowForm(false);

      await fetchStaff();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(staff: Staff) {
    const id = staff.id ?? staff.Id;

    if (id == null) {
      setError("Personel numarası bulunamadı.");
      return;
    }

    const name = staff.fullName ?? staff.FullName ?? "Bu personel";

    if (!window.confirm(`${name} silinsin mi?`)) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.title || "Personel silinemedi."
        );
      }

      setSuccess(data?.message || "Personel başarıyla silindi.");
      await fetchStaff();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold">Personeller</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sisteme kayıtlı personelleri yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Toplam: {staffList.length}
          </span>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingStaff(null);
                setForm(initialForm);
              } else {
                openCreateForm();
              }
              setError("");
              setSuccess("");
            }}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {showForm ? "Formu Kapat" : "+ Personel Ekle"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            type="button"
            onClick={() => void fetchStaff()}
            className="ml-3 font-semibold underline"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {success && (
        <p className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5"
        >
          <h4 className="mb-5 font-bold">
            {editingStaff
              ? "Personel Bilgilerini Düzenle"
              : "Yeni Personel Bilgileri"}
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Ad Soyad *
              <input
                required
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>

            <label className="text-sm font-medium">
              E-posta *
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>

            {!editingStaff && (
              <label className="text-sm font-medium">
                İlk Giriş Şifresi *
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </label>
            )}

            <label className="text-sm font-medium">
              Cinsiyet *
              <select
                required
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
              >
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </label>

            <label className="text-sm font-medium">
              Telefon
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>

            <label className="text-sm font-medium">
              Görev
              <input
                value={form.jobtitle}
                onChange={(e) => updateField("jobtitle", e.target.value)}
                placeholder="Örn. Hasta Kayıt Görevlisi"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Kaydediliyor..."
                : editingStaff
                  ? "Değişiklikleri Kaydet"
                  : "Personeli Kaydet"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-8 text-center text-gray-500">
          Personeller yükleniyor...
        </p>
      ) : staffList.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          Henüz kayıtlı personel bulunmuyor.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Cinsiyet</th>
                <th className="px-4 py-3">Görev</th>
                <th className="px-4 py-3">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {staffList.map((staff) => {
                const id = staff.id ?? staff.Id;

                return (
                  <tr
                    key={id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {staff.fullName ?? staff.FullName ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {staff.email ?? staff.Email ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      {staff.phone ?? staff.Phone ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      {staff.gender ?? staff.Gender ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      {staff.jobtitle ?? staff.Jobtitle ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(staff)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          Düzenle
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(staff)}
                          disabled={deletingId === id}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === id ? "Siliniyor..." : "Sil"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
