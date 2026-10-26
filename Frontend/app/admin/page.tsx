"use client";
import AdminNavbar, {
  type MenuType,
} from "@/components/admin/AdminNavbar";
import DoctorSection from "../../components/admin/DoctorSection"
import { useEffect, useState } from "react";
import OverviewSection from "@/components/admin/OverViewSection";
import StaffSection from "@/components/admin/StaffSection";
import PatientsSection from "@/components/admin/PatientSection";
import AppointmentSection from "@/components/admin/AppointmentSection";

const menuItems: {
  id: MenuType;
  label: string;
  icon: string;
}[] = [
    { id: "overview", label: "Genel Bakış", icon: "📊" },
    { id: "doctors", label: "Doktorlar", icon: "🩺" },
    { id: "staff", label: "Personel", icon: "👥" },
    { id: "patients", label: "Hastalar", icon: "🏥" },
    { id: "appointments", label: "Randevular", icon: "📅" },
  ];

export default function AdminPage() {
  const [activeMenu, setActiveMenu] =
    useState<MenuType>("overview");

 

type Doctor = {
  id: number;
  fullName: string;
  email: string;
  specialty: string;
  experienceYears: number;

  // Backend büyük harfli alanlar döndürürse de destekle
  Id?: number;
  FullName?: string;
  Email?: string;
  Specialty?: string;
  ExperienceYears?: number;
};

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState("");

  useEffect(() => {
    if (activeMenu !== "doctors") return;

    async function fetchDoctors() {
      setDoctorsLoading(true);
      setDoctorsError("");

      try {
        const response = await fetch("/api/doctors", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Doktorlar yüklenemedi."
          );
        }

        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        setDoctorsError(
          error instanceof Error
            ? error.message
            : "Bir hata oluştu."
        );
      } finally {
        setDoctorsLoading(false);
      }
    }

    fetchDoctors();
  }, [activeMenu]);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sol menü */}
      <AdminNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Ana içerik */}
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-5 sm:px-8">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              {menuItems.find((item) => item.id === activeMenu)?.label}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Hastane yönetim sistemine hoş geldiniz.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Yönetici
          </span>
        </header>

       <div className="p-5 sm:p-8">
  {activeMenu === "overview" && (
    <OverviewSection
      onNavigate={(menu) => setActiveMenu(menu)}
    />
  )}

  {activeMenu === "doctors" && <DoctorSection />}
  {activeMenu === "staff" && <StaffSection/>}
  {activeMenu === "patients" && <PatientsSection />}
  {activeMenu === "appointments" && <AppointmentSection />}
  
  {/* {activeMenu !== "overview" &&
    activeMenu !== "doctors" && (
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h3 className="text-xl font-bold">
          {menuItems.find((item) => item.id === activeMenu)?.label}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Bu bölümün backend bağlantısını bir sonraki aşamada ekleyeceğiz.
        </p>
      </div>
    )} */}
</div>
      </main>
    </div>
  );
}
