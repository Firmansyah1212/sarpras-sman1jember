"use client";

import { Menu } from "lucide-react";

interface Props {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">

      <div className="flex items-center gap-3">

        <button
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="font-bold text-lg">
            Sistem Peminjaman Sarpras
          </h1>

          <p className="text-xs text-slate-500">
            SMAN 1 Jember
          </p>
        </div>

      </div>

      <div>

        <span className="text-sm text-slate-500">

          Tahun Ajaran 2026/2027

        </span>

      </div>

    </header>
  );
}