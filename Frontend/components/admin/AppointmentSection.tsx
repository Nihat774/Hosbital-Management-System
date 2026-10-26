
"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  patientId: number;
  patientName: string;
  patientAge: number;
  patientPhone: string | null;
  doctorId: number;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  status: "Pending" | "Approved" | "Rejected";
};

export default function AppointmentsSection() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointment", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401 || response.status === 403
              ? "Bu sayfayı görüntüleme yetkiniz yok."
              : "Randevular yüklenemedi."
          );
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (status: Appointment["status"]) => {
    switch (status) {
      case "Approved":
        return {
          label: "Onaylandı",
          className: "bg-green-100 text-green-700",
        };
      case "Rejected":
        return {
          label: "Reddedildi",
          className: "bg-red-100 text-red-700",
        };
      default:
        return {
          label: "Bekliyor",
          className: "bg-yellow-100 text-yellow-700",
        };
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Randevular yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Randevular
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Sistemdeki tüm hasta randevularını görüntüleyin.
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 px-4 py-3">
          <span className="text-sm text-gray-600">
            Toplam Randevu
          </span>
          <p className="text-2xl font-bold text-blue-600">
            {appointments.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {appointments.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            Henüz randevu bulunmuyor.
          </p>
        ) : (
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Hasta</th>
                <th className="px-4 py-3">Doktor</th>
                <th className="px-4 py-3">Uzmanlık</th>
                <th className="px-4 py-3">Tarih ve Saat</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {appointments.map((appointment) => {
                const status = getStatus(appointment.status);

                return (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium text-gray-700">
                      #{appointment.id}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">
                        {appointment.patientName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.patientAge} yaş
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.patientPhone || "Telefon yok"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {appointment.doctorName}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {appointment.specialty}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(appointment.appointmentDate)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
