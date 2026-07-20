import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import StatsCard from "@/components/StatsCard";
import QuickAction from "@/components/QuickAction";

import {
  getSemuaPeminjaman,
  getPeminjamanHariIni,
  getJadwalAktif,
  getRuanganDigunakan,
} from "@/lib/actions";

export default async function HomePage() {
  const data = await getSemuaPeminjaman();

  const total = data.length;

  const menunggu = data.filter(
    (item: any) => item.status === "menunggu"
  ).length;

  const disetujui = data.filter(
    (item: any) => item.status === "disetujui"
  ).length;

  const ditolak = data.filter(
    (item: any) => item.status === "ditolak"
  ).length;

  const hariIni = await getPeminjamanHariIni();
  const jadwalAktif = await getJadwalAktif();
  const ruanganDigunakan = await getRuanganDigunakan();

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Si-Sarpras
        </h1>

        <p className="text-slate-500 mt-2">
          Sistem Peminjaman Sarana dan Prasarana
          SMAN 1 Jember
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatsCard
          title="Total Pengajuan"
          value={total}
          icon={<ClipboardList size={28} />}
        />

        <StatsCard
          title="Menunggu"
          value={menunggu}
          color="bg-amber-500"
          icon={<Clock3 size={28} />}
        />

        <StatsCard
          title="Disetujui"
          value={disetujui}
          color="bg-emerald-600"
          icon={<CheckCircle2 size={28} />}
        />

        <StatsCard
          title="Ditolak"
          value={ditolak}
          color="bg-red-600"
          icon={<XCircle size={28} />}
        />

      </div>

      <QuickAction />

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <h2 className="font-semibold text-lg mb-2">
            Pengajuan Hari Ini
          </h2>

          <p className="text-4xl font-bold text-blue-600">
            {hariIni}
          </p>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <h2 className="font-semibold text-lg mb-2">
            Jadwal Aktif
          </h2>

          <p className="text-4xl font-bold text-green-600">
            {jadwalAktif}
          </p>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <h2 className="font-semibold text-lg mb-2">
            Ruangan Digunakan
          </h2>

          {ruanganDigunakan.length === 0 ? (
            <p className="text-slate-500">
              Tidak ada
            </p>
          ) : (
            <ul className="space-y-2">
              {ruanganDigunakan.map((ruangan: string) => (
                <li
                  key={ruangan}
                  className="bg-slate-100 rounded-lg px-3 py-2"
                >
                  {ruangan}
                </li>
              ))}
            </ul>
          )}

        </div>

      </div>

    </div>
  );
}