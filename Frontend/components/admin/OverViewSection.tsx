
"use client";

import { useEffect, useState } from "react";

const menuItems = [
  { id: "doctors", label: "Doktorlar", icon: "🩺" },
  { id: "staff", label: "Personel", icon: "👥" },
  { id: "patients", label: "Hastalar", icon: "🏥" },
  { id: "appointments", label: "Randevular", icon: "📅" },
];

type OverviewSectionProps = {
  onNavigate: (
    menu: "doctors" | "staff" | "patients" | "appointments"
  ) => void;
};

type DashboardStats = {
  totalDoctors: number;
  totalStaff: number;
  totalPatients: number;
  totalAppointments: number;
};

const initialStats: DashboardStats = {
  totalDoctors: 0,
  totalStaff: 0,
  totalPatients: 0,
  totalAppointments: 0,
};

export default function OverviewSection({
  onNavigate,
}: OverviewSectionProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
  async function fetchDashboardStats() {
    try {
      const response = await fetch("/api/dashboard/stats", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Dashboard istatistikleri alınamadı.");
      }

      const data = await response.json();

      setStats({
        totalDoctors: data.totalDoctors ?? data.TotalDoctors ?? 0,
        totalStaff: data.totalStaff ?? data.TotalStaff ?? 0,
        totalPatients: data.totalPatients ?? data.TotalPatients ?? 0,
        totalAppointments:
          data.totalAppointments ?? data.TotalAppointments ?? 0,
      });
    } catch (err) {
      console.error("Dashboard istatistik hatası:", err);
      setError("İstatistikler yüklenemedi.");
    }
  }

  fetchDashboardStats();
}, []);

  const cards = [
    {
      label: "Toplam Doktor",
      icon: "🩺",
      color: "bg-blue-50",
      value: stats?.totalDoctors,
    },
    {
      label: "Toplam Personel",
      icon: "👥",
      color: "bg-purple-50",
      value: stats?.totalStaff,
    },
    {
      label: "Toplam Hasta",
      icon: "🏥",
      color: "bg-green-50",
      value: stats?.totalPatients,
    },
    {
      label: "Toplam Randevu",
      icon: "📅",
      color: "bg-orange-50",
      value: stats?.totalAppointments,
    },
  ];

  return (
    <>
      <div className="mb-7">
        <h3 className="text-lg font-bold">Genel Bakış</h3>
        <p className="mt-1 text-sm text-gray-500">
          Sistem yönetimi ve işlemlere buradan ulaşabilirsiniz.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${card.color}`}
            >
              {card.icon}
            </div>

            <p className="mt-5 text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">
              {stats === null ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="font-bold">Hızlı İşlemler</h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as OverviewSectionProps["onNavigate"] extends (menu: infer T) => void ? T : never)}
              className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="mt-3 text-sm font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-gray-500">
                Görüntüle ve yönet
              </p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
