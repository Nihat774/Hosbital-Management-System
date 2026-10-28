
"use client";

import { useEffect, useState } from "react";
import { logout } from "@/lib/logout";
import { FiCamera, FiLogOut, FiTrash2 } from "react-icons/fi";

type Tab = "appointments" | "profile" | "doctors";

type PatientProfile = {
    id: number;
    fullName: string;
    age: number;
    gender: string;
    phone: string | null;
    photoUrl: string | null;
};

type Doctor = {
    id: number;
    fullName: string;
    specialty: string;
    experienceYears: number;
    university: string;
    about: string | null;
    languages: string | null;
};

type Appointment = {
    id: number;
    doctorName: string;
    specialty: string;
    appointmentDate: string;
    status: string | number;
};

function getStatus(status: string | number) {
    const value = String(status).toLowerCase();

    if (value === "1" || value === "approved") {
        return {
            text: "Onaylandı",
            style: "bg-green-100 text-green-700",
        };
    }

    if (value === "2" || value === "rejected") {
        return {
            text: "Reddedildi",
            style: "bg-red-100 text-red-700",
        };
    }

    return {
        text: "Onay Bekliyor",
        style: "bg-yellow-100 text-yellow-700",
    };
}

export default function PatientPage() {
    const [activeTab, setActiveTab] = useState<Tab>("appointments");

    const [patient, setPatient] = useState<PatientProfile | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");


    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [savingPhoto, setSavingPhoto] = useState(false);
    const [photoMessage, setPhotoMessage] = useState("");
    const [photoError, setPhotoError] = useState("");

    async function loadPatientProfile() {
        try {
            const response = await fetch("/api/patients/my-profile", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Profil bilgileri yüklenemedi.");
            }

            setPatient({
                id: data.id ?? data.Id,
                fullName: data.fullName ?? data.FullName ?? "",
                age: data.age ?? data.Age,
                gender: data.gender ?? data.Gender ?? "",
                phone: data.phone ?? data.Phone ?? null,
                photoUrl: data.photoUrl ?? data.PhotoUrl ?? "/images/user-icon.avif"
            });
        } catch (err) {
            console.error("Profil yüklenemedi:", err);
        } finally {
            setLoadingProfile(false);
        }
    }

    async function savePatientProfile() {
        if (!patient) return;

        setSavingProfile(true);
        setProfileMessage("");
        setProfileError("");

        try {
            const response = await fetch("/api/patients/my-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: patient.fullName,
                    age: patient.age,
                    gender: patient.gender,
                    phone: patient.phone,
                    photoUrl: patient.photoUrl
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.title ||
                    "Profil bilgileri güncellenemedi."
                );
            }

            setProfileMessage("Bilgileriniz başarıyla güncellendi.");
            await loadPatientProfile();
        } catch (err) {
            setProfileError(
                err instanceof Error
                    ? err.message
                    : "Bir hata oluştu."
            );
        } finally {
            setSavingProfile(false);
        }
    }

    async function loadDoctors() {
        try {
            const response = await fetch("/api/doctors", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Doktorlar yüklenemedi.");
            }

            setDoctors(
                data.map((doctor: Record<string, unknown>) => ({
                    id: doctor.id ?? doctor.Id,
                    fullName: doctor.fullName ?? doctor.FullName,
                    specialty: doctor.specialty ?? doctor.Specialty,
                    experienceYears:
                        doctor.experienceYears ?? doctor.ExperienceYears,
                    university: doctor.university ?? doctor.University,
                    about: doctor.about ?? doctor.About ?? null,
                    languages: doctor.languages ?? doctor.Languages ?? null,
                }))
            );
        } catch (err) {
            console.error("Doktorlar yüklenemedi:", err);
        } finally {
            setLoadingDoctors(false);
        }
    }

    async function loadAppointments() {
        try {
            const response = await fetch("/api/appointment/my", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Randevular yüklenemedi.");
            }

            setAppointments(
                data.map((item: Record<string, unknown>) => ({
                    id: item.id ?? item.Id,
                    doctorName: item.doctorName ?? item.DoctorName,
                    specialty: item.specialty ?? item.Specialty,
                    appointmentDate:
                        item.appointmentDate ?? item.AppointmentDate,
                    status: item.status ?? item.Status,
                }))
            );
        } catch (err) {
            console.error("Randevular yüklenemedi:", err);
        } finally {
            setLoadingAppointments(false);
        }
    }

    useEffect(() => {
        loadPatientProfile();
        loadDoctors();
        loadAppointments();
    }, []);

    async function createAppointment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!selectedDoctor || !appointmentDate) {
            setError("Lütfen doktor ve randevu tarihini seçin.");
            return;
        }

        if (new Date(appointmentDate).getTime() <= Date.now()) {
            setError("Randevu tarihi gelecekte olmalıdır.");
            return;
        }

        setBooking(true);

        try {
            const response = await fetch("/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctorId: Number(selectedDoctor),
                    appointmentDate,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || data?.title || "Randevu oluşturulamadı."
                );
            }

            setMessage(data?.message || "Randevu talebiniz oluşturuldu.");
            setSelectedDoctor("");
            setAppointmentDate("");

            await loadAppointments();
            setActiveTab("appointments");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Bir hata oluştu."
            );
        } finally {
            setBooking(false);
        }
    }

    async function cancelAppointment(appointmentId: number) {
        const confirmed = window.confirm(
            "Bu randevuyu iptal etmek istediğinize emin misiniz?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `/api/appointment/${appointmentId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.title ||
                    "Randevu iptal edilemedi."
                );
            }

            await loadAppointments();
            setMessage("Randevunuz başarıyla iptal edildi.");
            setError("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Randevu iptal edilirken bir hata oluştu."
            );
        }
    }

    function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setPhotoError("Lütfen geçerli bir görsel dosyası seçin.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setPhotoError("Fotoğraf boyutu en fazla 5 MB olabilir.");
            return;
        }

        setSelectedPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        setPhotoMessage("");
        setPhotoError("");
    }

    async function savePatientPhoto() {
        if (!selectedPhoto) {
            setPhotoError("Lütfen önce bir fotoğraf seçin.");
            return;
        }

        setSavingPhoto(true);
        setPhotoMessage("");
        setPhotoError("");

        try {
            const formData = new FormData();
            formData.append("photo", selectedPhoto);

            const response = await fetch("/api/patients/my-profile/photo", {
                method: "PUT",
                body: formData,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Profil fotoğrafı güncellenemedi."
                );
            }

            setPhotoMessage("Profil fotoğrafınız başarıyla güncellendi.");
            setSelectedPhoto(null);
            setPhotoPreview(null);

            await loadPatientProfile();
        } catch (err) {
            setPhotoError(
                err instanceof Error
                    ? err.message
                    : "Fotoğraf güncellenirken bir hata oluştu."
            );
        } finally {
            setSavingPhoto(false);
        }
    }

    const tabs: [Tab, string][] = [
        ["appointments", "Randevularım"],
        ["doctors", "Doktorlar"],
        ["profile", "Bilgilerim"],]
    console.log(patient);


    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
                                ♙
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Hasta paneli
                                </p>
                                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                                    Hoş geldiniz
                                    {patient?.fullName
                                        ? `, ${patient.fullName}`
                                        : ""}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Sağlık işlemlerinizi buradan yönetin.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-xl flex cursor-pointer items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                            Çıkış Yap
                            <FiLogOut className="text-[16px]" />
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                    {tabs.map(([tab, label]) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg cursor-pointer px-5 py-3 text-sm font-semibold transition ${activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {activeTab === "appointments" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Randevularım
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Randevularınızı ve güncel durumlarını buradan
                                takip edebilirsiniz.
                            </p>

                            {loadingAppointments ? (
                                <p className="mt-6 text-gray-500">
                                    Randevular yükleniyor...
                                </p>
                            ) : appointments.length === 0 ? (
                                <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
                                    <p className="font-medium text-gray-700">
                                        Henüz randevunuz bulunmuyor.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab("doctors")}
                                        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Randevu Oluştur
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {appointments.map((appointment) => {
                                        const status = getStatus(
                                            appointment.status
                                        );

                                        return (
                                            <div
                                                key={appointment.id}
                                                className="rounded-xl border border-gray-200 p-5"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            Dr. {appointment.doctorName}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {appointment.specialty}
                                                        </p>
                                                        <p className="mt-2 text-sm text-gray-700">
                                                            {new Date(appointment.appointmentDate).toLocaleString("tr-TR", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${status.style}`}
                                                    >
                                                        {status.text}
                                                    </span>

                                                    <span className="w-[40px]">
                                                        {String(appointment.status).toLowerCase() === "0" ||
                                                            String(appointment.status).toLowerCase() === "pending" ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => cancelAppointment(appointment.id)}
                                                                className="rounded-lg border cursor-pointer border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        ) : null}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "doctors" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Doktorlar
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Bir doktor seçerek randevu talebinizi oluşturun.
                            </p>

                            {message && (
                                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                    {message}
                                </p>
                            )}

                            {error && (
                                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    {error}
                                </p>
                            )}

                            <form
                                onSubmit={createAppointment}
                                className="mt-6 grid gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5 sm:grid-cols-2"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Doktor Seçin
                                    </label>
                                    <select
                                        value={selectedDoctor}
                                        onChange={(event) =>
                                            setSelectedDoctor(event.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                                    >
                                        <option value="">
                                            Doktor seçiniz
                                        </option>
                                        {doctors.map((doctor) => (
                                            <option
                                                key={doctor.id}
                                                value={doctor.id}
                                            >
                                                Dr. {doctor.fullName} —{" "}
                                                {doctor.specialty}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Randevu Tarihi ve Saati
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={appointmentDate}
                                        onChange={(event) =>
                                            setAppointmentDate(event.target.value)
                                        }
                                        min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                            .toISOString()
                                            .slice(0, 16)}
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={booking || loadingDoctors}
                                        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {booking
                                            ? "Randevu Oluşturuluyor..."
                                            : "Randevu Talebi Oluştur"}
                                    </button>
                                </div>
                            </form>

                            <h3 className="mt-8 text-lg font-bold text-gray-900">
                                Doktorlarımız
                            </h3>

                            {loadingDoctors ? (
                                <p className="mt-4 text-gray-500">
                                    Doktorlar yükleniyor...
                                </p>
                            ) : doctors.length === 0 ? (
                                <p className="mt-4 text-gray-500">
                                    Görüntülenecek doktor bulunamadı.
                                </p>
                            ) : (
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {doctors.map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300"
                                        >
                                            <h4 className="font-semibold text-gray-900">
                                                Dr. {doctor.fullName}
                                            </h4>
                                            <p className="mt-1 text-sm font-medium text-blue-600">
                                                {doctor.specialty}
                                            </p>
                                            <p className="mt-3 text-sm text-gray-600">
                                                Deneyim: {doctor.experienceYears} yıl
                                            </p>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Üniversite: {doctor.university}
                                            </p>
                                            {doctor.about && (
                                                <p className="mt-3 text-sm text-gray-500">
                                                    {doctor.about}
                                                </p>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDoctor(
                                                        String(doctor.id)
                                                    );
                                                    setError("");
                                                    setMessage("");
                                                }}
                                                className="mt-4 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                                            >
                                                Bu Doktoru Seç
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Bilgilerim
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Kişisel bilgilerinizi görüntüleyebilir ve güncelleyebilirsiniz.
                            </p>

                            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="relative h-24 w-24 shrink-0">
                                    <img
                                        src={
                                            photoPreview ||
                                            (patient?.photoUrl
                                                ? `http://localhost:5041${patient.photoUrl}`
                                                : "/images/user-icon.avif") ||
                                            "/images/user-icon.avif"
                                        }
                                        alt="Profil fotoğrafı"
                                        className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                                    />

                                    <label
                                        htmlFor="profilePhoto"
                                        className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white transition hover:bg-blue-700"
                                        title="Fotoğraf seç"
                                    >
                                        <FiCamera size={16} />
                                    </label>

                                    <input
                                        id="profilePhoto"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {patient?.fullName || "Hasta"}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        JPG, PNG veya diğer görsel formatları. En fazla 5 MB.
                                    </p>

                                    {selectedPhoto && (
                                        <button
                                            type="button"
                                            onClick={savePatientPhoto}
                                            disabled={savingPhoto}
                                            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {savingPhoto ? "Yükleniyor..." : "Fotoğrafı Kaydet"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {photoMessage && (
                                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                    {photoMessage}
                                </p>
                            )}

                            {photoError && (
                                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    {photoError}
                                </p>
                            )}

                            {loadingProfile ? (
                                <p className="mt-6 text-gray-500">
                                    Bilgileriniz yükleniyor...
                                </p>
                            ) : patient ? (
                                <form
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        await savePatientProfile();
                                    }}
                                    className="mt-6"
                                >
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Ad Soyad
                                            </label>
                                            <input
                                                type="text"
                                                value={patient.fullName}
                                                onChange={(event) =>
                                                    setPatient({
                                                        ...patient,
                                                        fullName: event.target.value,
                                                    })
                                                }
                                                required
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Yaş
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={patient.age}
                                                onChange={(event) =>
                                                    setPatient({
                                                        ...patient,
                                                        age: Number(event.target.value),
                                                    })
                                                }
                                                required
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Cinsiyet
                                            </label>
                                            <select
                                                value={patient.gender}
                                                onChange={(event) =>
                                                    setPatient({
                                                        ...patient,
                                                        gender: event.target.value,
                                                    })
                                                }
                                                required
                                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="">Cinsiyet seçiniz</option>
                                                <option value="Erkek">Erkek</option>
                                                <option value="Kadın">Kadın</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                value={patient.phone ?? ""}
                                                onChange={(event) =>
                                                    setPatient({
                                                        ...patient,
                                                        phone: event.target.value || null,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                placeholder="Telefon numaranız"
                                            />
                                        </div>
                                    </div>

                                    {profileMessage && (
                                        <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                            {profileMessage}
                                        </p>
                                    )}

                                    {profileError && (
                                        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                            {profileError}
                                        </p>
                                    )}

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {savingProfile
                                                ? "Kaydediliyor..."
                                                : "Değişiklikleri Kaydet"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="mt-6 text-red-600">
                                    Profil bilgileri yüklenemedi.
                                </p>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
