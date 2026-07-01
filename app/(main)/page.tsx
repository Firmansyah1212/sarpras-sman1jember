import { getPeminjamanHariIni, getJadwalAktif, getRuanganDigunakan, getSemuaPeminjaman } from "@/lib/actions";
import StatsCard from "@/components/StatsCard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { CalendarCheck, Clock, Building2 } from "lucide-react";

export default async function Dashboard() {
  const [hariIni, jadwalAktif, ruanganUsed, allPeminjaman] = await Promise.all([
    getPeminjamanHariIni(), getJadwalAktif(), getRuanganDigunakan(), getSemuaPeminjaman({ status: 'disetujui' })
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Peminjaman</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Peminjaman Hari Ini" value={hariIni} icon={CalendarCheck} />
        <StatsCard title="Jadwal Aktif" value={jadwalAktif} icon={Clock} />
        <StatsCard title="Ruangan Digunakan" value={ruanganUsed.join(', ') || 'Tidak ada'} icon={Building2} />
      </div>
      <WeeklyCalendar events={allPeminjaman} />
    </div>
  );
}
