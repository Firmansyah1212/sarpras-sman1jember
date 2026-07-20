"use client";

import { Menu, Calendar, User, LogOut } from "lucide-react";

interface Props {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm h-16 flex items-center justify-between px-6 transition-all duration-200">
      
      {/* Kiri: Menu toggle + Brand */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md">
            SP
          </div>
          <div>
            <h1 className="font-semibold text-gray-800 text-base tracking-tight leading-tight">
              Sistem Peminjaman Sarpras
            </h1>
            <p className="text-[11px] font-medium text-gray-500 tracking-wide">
              SMAN 1 Jember
            </p>
          </div>
        </div>
      </div>

      {/* Kanan: Tahun ajaran + Profile (optional) */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-50/80 px-3 py-1.5 rounded-full border border-gray-200/60">
          <Calendar size={14} className="text-gray-400" />
          <span className="font-medium">2026/2027</span>
        </div>

        {/* Profile avatar (placeholder) */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm ring-2 ring-white/60">
            A
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>

    </header>
  );
}