import Link from "next/link";
import { Calendar, FilePlus2, List } from "lucide-react";

export default function QuickAction() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <Link
        href="/pinjam"
        className="rounded-2xl bg-blue-600 text-white p-5 hover:bg-blue-700 transition"
      >
        <FilePlus2 className="mb-3" size={28} />
        <h3 className="font-semibold">
          Ajukan Peminjaman
        </h3>
      </Link>

      <Link
        href="/daftar"
        className="rounded-2xl bg-emerald-600 text-white p-5 hover:bg-emerald-700 transition"
      >
        <List className="mb-3" size={28} />
        <h3 className="font-semibold">
          Daftar Pengajuan
        </h3>
      </Link>

      <Link
        href="/daftar"
        className="rounded-2xl bg-orange-500 text-white p-5 hover:bg-orange-600 transition"
      >
        <Calendar className="mb-3" size={28} />
        <h3 className="font-semibold">
          Jadwal Peminjaman
        </h3>
      </Link>

    </div>
  );
}