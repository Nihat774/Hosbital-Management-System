
"use client";

import { useCallback, useEffect, useState } from "react";
type DoctorPhoto = {
    file: File;
    preview: string;
};

type Doctor = {
    id?: number;
    Id?: number;
    fullName?: string;
    FullName?: string;
    email?: string;
    Email?: string;
    gender?: string;
    Gender?: string;
    phone?: string | null;
    Phone?: string | null;
    photoUrl?: string | null;
    PhotoUrl?: string | null;
    specialty?: string;
    Specialty?: string;
    experienceYears?: number;
    ExperienceYears?: number;
    university?: string;
    University?: string;
    about?: string | null;
    About?: string | null;
    languages?: string | null;
    Languages?: string | null;
};

type DoctorForm = {
    fullName: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
    photoUrl: string;
    specialty: string;
    experienceYears: string;
    university: string;
    about: string;
    languages: string;
};

const initialForm: DoctorForm = {
    fullName: "",
    email: "",
    password: "",
    gender: "Erkek",
    phone: "",
    photoUrl: "",
    specialty: "",
    experienceYears: "0",
    university: "",
    about: "",
    languages: "",
};

export default function DoctorsSection() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState<DoctorForm>(initialForm);
    const [photo, setPhoto] = useState<DoctorPhoto | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [deletingDoctorId, setDeletingDoctorId] = useState<number | null>(null);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/doctors", {
                cache: "no-store",
            });
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Doktor ekleme hatası:", data);

                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                        data?.title ||
                        JSON.stringify(data) ||
                        "Doktor eklenemedi."
                );
            }

            setDoctors(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchDoctors();
    }, [fetchDoctors]);

    function updateField(
        field: keyof DoctorForm,
        value: string
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }


    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            let photoUrl =
                editingDoctor
                    ? editingDoctor.photoUrl ?? editingDoctor.PhotoUrl ?? ""
                    : "";

            if (photo) {
                setUploadingPhoto(true);

                const uploadData = new FormData();
                uploadData.append("file", photo.file);

                const uploadResponse = await fetch("/api/doctors/upload", {
                    method: "POST",
                    body: uploadData,
                });

                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(
                        uploadResult?.message || "Fotoğraf yüklenemedi."
                    );
                }

                photoUrl = uploadResult.url;
            }

            const doctorId = editingDoctor
                ? editingDoctor.id ?? editingDoctor.Id
                : undefined;

            const response = await fetch(
                editingDoctor ? `/api/doctors/${doctorId}` : "/api/doctors",
                {
                    method: editingDoctor ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...form,
                        experienceYears: Number(form.experienceYears),
                        phone: form.phone || null,
                        photoUrl: photoUrl || null,
                        about: form.about || null,
                        languages: form.languages || null,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || data?.title || "Doktor kaydedilemedi."
                );
            }

            setSuccess(
                data?.message ||
                (editingDoctor
                    ? "Doktor bilgileri güncellendi."
                    : "Doktor başarıyla eklendi.")
            );

            setForm(initialForm);
            setPhoto(null);
            setEditingDoctor(null);
            setShowForm(false);
            setEditingDoctor(null);

            await fetchDoctors();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setSaving(false);
            setUploadingPhoto(false);
        }
    }


    function handleEditDoctor(doctor: Doctor) {
        setEditingDoctor(doctor);
        setForm({
            fullName: doctor.fullName ?? doctor.FullName ?? "",
            email: doctor.email ?? doctor.Email ?? "",
            password: "",
            gender: doctor.gender ?? doctor.Gender ?? "Erkek",
            phone: doctor.phone ?? doctor.Phone ?? "",
            photoUrl: doctor.photoUrl ?? doctor.PhotoUrl ?? "",
            specialty: doctor.specialty ?? doctor.Specialty ?? "",
            experienceYears: String(
                doctor.experienceYears ?? doctor.ExperienceYears ?? 0
            ),
            university: doctor.university ?? doctor.University ?? "",
            about: doctor.about ?? doctor.About ?? "",
            languages: doctor.languages ?? doctor.Languages ?? "",
        });

        setPhoto(null);
        setError("");
        setSuccess("");
        setShowForm(true);
    }


    async function handleDeleteDoctor(doctor: Doctor) {
        const id = doctor.id ?? doctor.Id;

        if (id == null) {
            setError("Doktor numarası bulunamadı.");
            return;
        }

        const confirmed = window.confirm(
            `${doctor.fullName ?? doctor.FullName ?? "Bu doktor"} silinsin mi?`
        );

        if (!confirmed) return;

        setDeletingDoctorId(id);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`/api/doctors/${id}`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.title ||
                    "Doktor silinemedi."
                );
            }

            setSuccess(data?.message || "Doktor başarıyla silindi.");
            await fetchDoctors();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setDeletingDoctorId(null);
        }
    }




    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-xl font-bold">Doktorlar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Sisteme kayıtlı doktorları yönetin.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        Toplam: {doctors.length}
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm((previous) => !previous);
                            setError("");
                            setSuccess("");
                            setEditingDoctor(null);
                            setForm(initialForm);
                            setPhoto(null);
                        }}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        {showForm ? "Formu Kapat" : "+ Doktor Ekle"}
                    </button>
                </div>
            </div>

            {error && (
                <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </p>
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
                        {editingDoctor ? "Doktor Bilgilerini Düzenle" : "Yeni Doktor Bilgileri"}
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

                        {!editingDoctor && (
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
                            Uzmanlık Alanı *
                            <input
                                required
                                value={form.specialty}
                                onChange={(e) => updateField("specialty", e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </label>

                        <label className="text-sm font-medium">
                            Deneyim (yıl) *
                            <input
                                required
                                type="number"
                                min="0"
                                value={form.experienceYears}
                                onChange={(e) => updateField("experienceYears", e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </label>

                        <label className="text-sm font-medium">
                            Üniversite *
                            <input
                                required
                                value={form.university}
                                onChange={(e) => updateField("university", e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                            />
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


                        <div className="text-sm font-medium">
                            Doktor Fotoğrafı
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (!file) return;

                                    if (file.size > 5 * 1024 * 1024) {
                                        setError("Fotoğraf boyutu en fazla 5 MB olabilir.");
                                        e.target.value = "";
                                        return;
                                    }

                                    setError("");

                                    setPhoto({
                                        file,
                                        preview: URL.createObjectURL(file),
                                    });
                                }}
                                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                            />


                            {(photo || form.photoUrl) && (
                                <div className="mt-3">
                                    <img
                                        src={photo?.preview || form.photoUrl}
                                        alt="Doktor fotoğrafı önizlemesi"
                                        className="h-28 w-28 rounded-xl border border-gray-200 object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (photo) {
                                                URL.revokeObjectURL(photo.preview);
                                                setPhoto(null);
                                            } else {
                                                setForm((previous) => ({
                                                    ...previous,
                                                    photoUrl: "",
                                                }));
                                            }
                                        }}
                                        className="mt-2 block text-sm text-red-600 hover:text-red-700"
                                    >
                                        Fotoğrafı kaldır
                                    </button>
                                </div>
                            )}


                            <p className="mt-1 text-xs text-gray-500">
                                JPG, PNG veya WebP. En fazla 5 MB.
                            </p>
                        </div>


                        <label className="text-sm font-medium">
                            Diller
                            <input
                                placeholder="Türkçe, İngilizce"
                                value={form.languages}
                                onChange={(e) => updateField("languages", e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </label>

                        <label className="text-sm font-medium sm:col-span-2">
                            Hakkında
                            <textarea
                                rows={3}
                                value={form.about}
                                onChange={(e) => updateField("about", e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving || uploadingPhoto}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {uploadingPhoto
                                ? "Fotoğraf yükleniyor..."
                                : saving
                                    ? "Kaydediliyor..."
                                    : "Doktoru Kaydet"}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="py-8 text-center text-gray-500">
                    Doktorlar yükleniyor...
                </p>
            ) : doctors.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                    Henüz kayıtlı doktor bulunmuyor.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="border-b bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-4 py-3">Fotoğraf</th>
                                <th className="px-4 py-3">Ad Soyad</th>
                                <th className="px-4 py-3">Uzmanlık</th>
                                <th className="px-4 py-3">Deneyim</th>
                                <th className="px-4 py-3">E-posta</th>
                                <th className="px-4 py-3">İşlemler</th>
                            </tr>
                        </thead>

                        <tbody>
                            {doctors.map((doctor) => (
                                <tr
                                    key={doctor.id ?? doctor.Id}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-4 font-semibold">
                                        <img className="size-7.5 rounded-full object-cover" src={doctor.photoUrl || "/logo.png"} alt="" />


                                    </td>
                                    <td className="px-4 py-4 font-semibold">
                                        {doctor.fullName ?? doctor.FullName}
                                    </td>
                                    <td className="px-4 py-4">
                                        {doctor.specialty ?? doctor.Specialty}
                                    </td>
                                    <td className="px-4 py-4">
                                        {doctor.experienceYears ?? doctor.ExperienceYears} yıl
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">
                                        {doctor.email ?? doctor.Email}
                                    </td>


                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditDoctor(doctor)}
                                                className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                            >
                                                Düzenle
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteDoctor(doctor)}
                                                disabled={
                                                    deletingDoctorId === (doctor.id ?? doctor.Id)
                                                }
                                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                            >
                                                {deletingDoctorId === (doctor.id ?? doctor.Id)
                                                    ? "Siliniyor..."
                                                    : "Sil"}
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
