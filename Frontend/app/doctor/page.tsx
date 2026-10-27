
"use client";

import { logout } from "@/lib/logout";
import { useEffect, useState } from "react";

type Appointment = {
    id: number;
    patientName: string;
    patientAge: number;
    patientPhone: string | null;
    appointmentDate: string;
    status: "Pending" | "Approved" | "Rejected";
};

type DoctorProfile = {
    id: number;
    fullName: string;
    email: string;
    gender: string;
    phone: string | null;
    photoUrl: string | null;
    specialty: string;
    experienceYears: number;
    university: string;
    about: string | null;
    languages: string | null;
};

type Tab = "appointments" | "profile";

export default function DoctorPage() {
    const [activeTab, setActiveTab] = useState<Tab>("appointments");

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [appointmentError, setAppointmentError] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);

    async function loadAppointments() {
        try {
            setAppointmentError("");

            const response = await fetch(
                "/api/appointment/doctor/my",
                { cache: "no-store" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Randevular yüklenemedi."
                );
            }

            setAppointments(data);
        } catch (err) {
            setAppointmentError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setLoadingAppointments(false);
        }
    }

    async function loadProfile() {
        setLoadingProfile(true);
        setProfileError("");
        setProfileMessage("");

        try {
            const response = await fetch(
                "/api/doctors/my-profile",
                { cache: "no-store" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Profil bilgileri yüklenemedi."
                );
            }

            setProfile(data);
        } catch (err) {
            setProfileError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setLoadingProfile(false);
        }
    }

    useEffect(() => {
    loadAppointments();
    loadProfile();
}, []);

    async function updateAppointment(
        id: number,
        action: "approve" | "reject"
    ) {
        try {
            setAppointmentError("");
            setUpdatingId(id);

            const response = await fetch(
                `/api/appointment/${id}/${action}`,
                { method: "PUT" }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Randevu durumu güncellenemedi."
                );
            }

            await loadAppointments();
        } catch (err) {
            setAppointmentError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function updateProfileField(
        field: keyof DoctorProfile,
        value: string | number
    ) {
        setProfile((current) =>
            current ? { ...current, [field]: value } : current
        );
    }

    async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!profile) return;

        setSavingProfile(true);
        setProfileError("");
        setProfileMessage("");

        try {
            const response = await fetch("/api/doctors/my-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: profile.fullName,
                    phone: profile.phone ?? "",
                    specialty: profile.specialty,
                    experienceYears: profile.experienceYears,
                    university: profile.university,
                    about: profile.about ?? "",
                    languages: profile.languages ?? "",
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Profil güncellenemedi."
                );
            }

            setProfileMessage(
                data?.message || "Profil bilgileriniz güncellendi."
            );

            await loadProfile();
        } catch (err) {
            setProfileError(
                err instanceof Error ? err.message : "Bir hata oluştu."
            );
        } finally {
            setSavingProfile(false);
        }
    }

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-6xl">



               
<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        {/* Doktor bilgileri */}
        <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
                {profile?.fullName
                    ? profile.fullName
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()
                    : "DR"}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">
                    Hoş geldiniz,
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                    {profile?.fullName || "Doktor"}
                </h2>
                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {profile?.specialty || "Uzmanlık alanı"}
                </span>
            </div>
        </div>

        {/* Panel başlığı ve çıkış */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:justify-end">
            <div className="md:text-right">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Doktor Paneli
                </h1>
                <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500 md:ml-auto">
                    Randevularınızı ve profil bilgilerinizi buradan yönetin.
                </p>
            </div>

            <button
                type="button"
                onClick={logout}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
                <span aria-hidden="true">↪</span>
                Çıkış Yap
            </button>
        </div>
    </div>
</div>



                <div className="mt-8 flex flex-wrap gap-3 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("profile");
                            if (!profile) loadProfile();
                        }}
                        className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === "profile"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Profilim
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("appointments")}
                        className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === "appointments"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Randevularım
                    </button>


                </div>

                {activeTab === "profile" && (
                    <section className="mt-8">
                        {loadingProfile ? (
                            <p className="text-gray-600">
                                Profil bilgileriniz yükleniyor...
                            </p>
                        ) : profileError && !profile ? (
                            <p className="rounded-xl bg-red-50 p-4 text-red-700">
                                {profileError}
                            </p>
                        ) : !profile ? (
                            <p className="text-gray-600">
                                Profil bilgileri bulunamadı.
                            </p>
                        ) : (
                            <form
                                onSubmit={saveProfile}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                            >
                                <div className="mb-7">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Profil Bilgilerim
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                       Kişisel ve mesleki bilgilerinizi düzenleyebilirsiniz.
                                    </p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Ad Soyad
                                        </label>
                                        <input
                                            required
                                            value={profile.fullName}
                                            onChange={(e) =>
                                                updateProfileField("fullName", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            E-posta
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            readOnly
                                            className={`${inputClass} bg-gray-100 text-gray-500`}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            E-posta adresi bu bölümden değiştirilemez.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Telefon
                                        </label>
                                        <input
                                            required
                                            value={profile.phone ?? ""}
                                            onChange={(e) =>
                                                updateProfileField("phone", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Uzmanlık Alanı
                                        </label>
                                        <input
                                            required
                                            value={profile.specialty}
                                            onChange={(e) =>
                                                updateProfileField("specialty", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Deneyim (Yıl)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={profile.experienceYears}
                                            onChange={(e) =>
                                                updateProfileField(
                                                    "experienceYears",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Üniversite
                                        </label>
                                        <input
                                            required
                                            value={profile.university}
                                            onChange={(e) =>
                                                updateProfileField("university", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Cinsiyet
                                        </label>
                                        <input
                                            value={profile.gender}
                                            readOnly
                                            className={`${inputClass} bg-gray-100 text-gray-500`}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Bildiği Diller
                                        </label>
                                        <input
                                            value={profile.languages ?? ""}
                                            onChange={(e) =>
                                                updateProfileField("languages", e.target.value)
                                            }
                                            placeholder="Türkçe, İngilizce..."
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Hakkımda
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={profile.about ?? ""}
                                            onChange={(e) =>
                                                updateProfileField("about", e.target.value)
                                            }
                                            placeholder="Mesleki deneyiminiz ve uzmanlığınız hakkında..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {profileError && (
                                    <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                                        {profileError}
                                    </p>
                                )}

                                {profileMessage && (
                                    <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                                        {profileMessage}
                                    </p>
                                )}

                                <div className="mt-7 flex justify-end">
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
                        )}
                    </section>
                )}

                {activeTab === "appointments" && (
                    <section className="mt-8">
                        {loadingAppointments ? (
                            <p className="text-gray-600">
                                Randevular yükleniyor...
                            </p>
                        ) : appointmentError ? (
                            <p className="rounded-xl bg-red-50 p-4 text-red-700">
                                {appointmentError}
                            </p>
                        ) : appointments.length === 0 ? (
                            <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
                                Henüz randevunuz bulunmuyor.
                            </p>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2">
                                {appointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {appointment.patientName}
                                            </h2>

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                {appointment.status === "Pending"
                                                    ? "Beklemede"
                                                    : appointment.status === "Approved"
                                                        ? "Onaylandı"
                                                        : "Reddedildi"}
                                            </span>
                                        </div>

                                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                                            <p>
                                                <strong>Yaş:</strong>{" "}
                                                {appointment.patientAge}
                                            </p>
                                            <p>
                                                <strong>Telefon:</strong>{" "}
                                                {appointment.patientPhone || "Belirtilmemiş"}
                                            </p>
                                            <p>
                                                <strong>Randevu tarihi:</strong>{" "}
                                                {new Date(
                                                    appointment.appointmentDate
                                                ).toLocaleString("tr-TR")}
                                            </p>
                                        </div>

                                        {appointment.status === "Pending" && (
                                            <div className="mt-5 flex gap-3">
                                                <button
                                                    disabled={updatingId !== null}
                                                    onClick={() =>
                                                        updateAppointment(
                                                            appointment.id,
                                                            "approve"
                                                        )
                                                    }
                                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {updatingId === appointment.id
                                                        ? "İşleniyor..."
                                                        : "Onayla"}
                                                </button>

                                                <button
                                                    disabled={updatingId !== null}
                                                    onClick={() =>
                                                        updateAppointment(
                                                            appointment.id,
                                                            "reject"
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {updatingId === appointment.id
                                                        ? "İşleniyor..."
                                                        : "Reddet"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}


            </div>
        </main>
    );
}
