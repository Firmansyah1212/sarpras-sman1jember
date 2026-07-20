"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Shield,
  X,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Peminjaman",
    href: "/pinjam",
    icon: FileText,
  },
  {
    title: "Daftar",
    href: "/daftar",
    icon: Calendar,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 lg:hidden">
          <div>
            <h2 className="font-bold text-xl text-gray-800">SMAN 1 Jember</h2>
            <p className="text-xs text-gray-500">Sistem Peminjaman Sarpras</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Tutup sidebar"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Header desktop */}
        <div className="hidden lg:block p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              SP
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800">SMAN 1 Jember</h2>
              <p className="text-xs text-gray-500">Sistem Peminjaman Sarpras</p>
            </div>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;

            return (
              <Link
                key={menu.title}
                href={menu.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {menu.title}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <p className="text-[11px] text-gray-400 text-center">
            © {new Date().getFullYear()} SMAN 1 Jember
          </p>
        </div>
      </aside>
    </>
  );
}