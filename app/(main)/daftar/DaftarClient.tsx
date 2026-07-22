'use client';

import { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';

export default function DaftarClient({ data }: { data: any[] }) {
  const [search, setSearch] = useState('');
  const [filterRuangan, setFilterRuangan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const filtered = data.filter((item) => {
    return (
      (item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.kelas.toLowerCase().includes(search.toLowerCase())) &&
      (!filterRuangan || item.ruangan === filterRuangan) &&
      (!filterStatus || item.status === filterStatus)
    );
  });

  const statusBadge = (status: string) => {
    const map: any = {
      menunggu: 'bg-yellow-100 text-yellow-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Daftar Peminjaman</h1>
          <p className="text-slate-500 text-sm mt-1">
            Seluruh data peminjaman sarana dan prasarana.
          </p>
        </div>

        {/* Filter */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari nama atau kelas..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterRuangan}
            onChange={(e) => setFilterRuangan(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="">Semua Ruangan</option>
            <option>Aula Pratama</option>
            <option>Aula Madya</option>
<option>Aula Jarkasi</option>
<option>Lab Komputer 1</option>
<option>Lab Komputer 2</option>
<option>Lab Komputer 3</option>
<option>Lapangan</option>
<option>Ruang Rapat</option>
<option>Gedung A</option>
<option>Gedung B</option>
<option>Gedung C</option>
<option>Gedung D</option>
<option>Gedung E</option>
<option>Gedung F</option>
<option>Gedung G</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        {/* ================= TABEL DESKTOP (FULL WIDTH, NO SCROLL) ================= */}
        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500">
                  <th className="w-[18%] px-3 py-3 text-left font-semibold">Nama</th>
                  <th className="w-[12%] px-3 py-3 text-left font-semibold">Kelas</th>
                  <th className="w-[14%] px-3 py-3 text-left font-semibold">Ruangan</th>
                  <th className="w-[12%] px-3 py-3 text-left font-semibold">Tanggal</th>
                  <th className="w-[12%] px-3 py-3 text-left font-semibold">Jam</th>
                  <th className="w-[18%] px-3 py-3 text-left font-semibold">Keperluan</th>
                  <th className="w-[10%] px-3 py-3 text-left font-semibold">Status</th>
                  <th className="w-[8%] px-3 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="px-3 py-2.5 font-medium text-gray-800 truncate" title={item.nama}>
                      {item.nama}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600 truncate">{item.kelas}</td>
                    <td className="px-3 py-2.5 text-gray-600 truncate">{item.ruangan}</td>
                    <td className="px-3 py-2.5 text-gray-600">{item.tanggal}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">
                      {item.jam_mulai?.slice(0, 5)} - {item.jam_selesai?.slice(0, 5)}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">
                      <div className="truncate max-w-[180px]" title={item.keperluan}>
                        {item.keperluan}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">{statusBadge(item.status)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => setSelected(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MOBILE (KARTU) ================= */}
        <div className="lg:hidden space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.nama}</h3>
                  <p className="text-sm text-gray-500">{item.kelas}</p>
                </div>
                {statusBadge(item.status)}
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                <p><span className="font-medium">Ruangan:</span> {item.ruangan}</p>
                <p><span className="font-medium">Tanggal:</span> {item.tanggal}</p>
                <p><span className="font-medium">Jam:</span> {item.jam_mulai?.slice(0, 5)} - {item.jam_selesai?.slice(0, 5)}</p>
                <p><span className="font-medium">Keperluan:</span></p>
                <p className="text-gray-700 bg-gray-50 rounded-lg px-3 py-2 text-sm">{item.keperluan}</p>
              </div>

              <button
                onClick={() => setSelected(item)}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">Detail Peminjaman</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Nama</p>
                <p className="font-medium text-gray-800">{selected.nama}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Kelas</p>
                <p className="font-medium text-gray-800">{selected.kelas}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Ruangan</p>
                <p className="font-medium text-gray-800">{selected.ruangan}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Tanggal</p>
                <p className="font-medium text-gray-800">{selected.tanggal}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Jam</p>
                <p className="font-medium text-gray-800">
                  {selected.jam_mulai} - {selected.jam_selesai}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Status</p>
                {statusBadge(selected.status)}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1.5">Keperluan</p>
              <div className="rounded-xl bg-gray-50 p-4 text-gray-700 text-sm">
                {selected.keperluan}
              </div>
              {selected.status === "ditolak" && selected.alasan_penolakan && (
  <div className="mt-5">
    <p className="text-red-600 text-xs uppercase tracking-wide mb-1.5 font-semibold">
      Alasan Penolakan
    </p>

    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
      {selected.alasan_penolakan}
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}