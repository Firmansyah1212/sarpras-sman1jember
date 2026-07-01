'use client';
import Link from "next/link";
import { Calendar, ClipboardList, LayoutDashboard, UserCog } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-700 flex items-center gap-2">
              <Calendar className="w-6 h-6" /> SMAN 1 Jember
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"><LayoutDashboard size={16}/> Dashboard</Link>
              <Link href="/pinjam" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"><ClipboardList size={16}/> Form Peminjaman</Link>
              <Link href="/daftar" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"><Calendar size={16}/> Daftar</Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/admin/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"><UserCog size={16}/> Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
