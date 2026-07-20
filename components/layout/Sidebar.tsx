"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Shield
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "Peminjaman",
    href: "/pinjam",
    icon: FileText
  },
  {
    title: "Daftar",
    href: "/daftar",
    icon: Calendar
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield
  }
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col">

      <div className="p-6">

        <h2 className="font-bold text-xl">

          SMAN 1 Jember

        </h2>

      </div>

      <nav className="px-4 space-y-2">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (
            <Link
              key={menu.title}
              href={menu.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-blue-50 transition"
            >

              <Icon size={20} />

              {menu.title}

            </Link>
          );

        })}

      </nav>

    </aside>
  );
}