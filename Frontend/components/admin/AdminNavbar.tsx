
"use client";

import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

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

type AdminNavbarProps = {
  activeMenu: MenuType;
  setActiveMenu: React.Dispatch<React.SetStateAction<MenuType>>;
};

export type MenuType =
  | "overview"
  | "doctors"
  | "staff"
  | "patients"
  | "appointments";



export default function AdminNavbar({ activeMenu, setActiveMenu }: AdminNavbarProps) {

  return (
    <aside className="hidden w-64 shrink-0 bg-slate-900 text-white md:flex md:flex-col">
      <div className="border-b border-slate-700 px-6 py-7">
        <h1 className="text-xl font-bold">MediCare</h1>
        <p className="mt-1 text-sm text-slate-400">
          Yönetim Paneli
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`flex cursor-pointer  w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${activeMenu === item.id
              ? "bg-blue-600 text-white"
              : "text-slate-300 hover:bg-slate-800"
              }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}


      </nav>
      <button
        onClick={logout}
        className="cursor-pointer mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-slate-800 hover:text-red-200 disabled:opacity-50"
      >
       <FiLogOut className="text-xl" />
        Çıkış Yap
      </button>
      <div className="border-t border-slate-700 p-4">
        <p className="text-sm font-medium">Yönetici</p>
        <p className="mt-1 text-xs text-slate-400">
          MediCare Yönetim Sistemi
        </p>

      </div>
    </aside>
  );
}
