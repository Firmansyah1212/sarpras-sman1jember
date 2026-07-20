'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ClipboardList,
  LayoutDashboard,
  UserCog,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const menus = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/pinjam",
      label: "Pinjam",
      icon: ClipboardList,
    },
    {
      href: "/daftar",
      label: "Daftar",
      icon: Calendar,
    },
    {
      href: "/admin/login",
      label: "Admin",
      icon: UserCog,
    },
  ];

  return (
    <>
      {/* =================== DESKTOP =================== */}
      <nav className="hidden md:block bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-600"
            >
              <Calendar className="w-6 h-6" />
              SMAN 1 Jember
            </Link>

            <div className="flex gap-2">
              {menus.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* =================== MOBILE HEADER =================== */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="h-14 flex items-center justify-center font-bold text-lg text-blue-600">
          📅 SMAN 1 Jember
        </div>
      </header>

      {/* =================== MOBILE BOTTOM NAV =================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="grid grid-cols-4 h-16">
          {menus.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center transition ${
                  active
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                <Icon size={22} />
                <span className="text-[11px] mt-1">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}