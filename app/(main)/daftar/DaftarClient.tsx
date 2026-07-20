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
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Daftar Peminjaman
          </h1>

          <p className="text-slate-500 mt-1">
            Seluruh data peminjaman sarana dan prasarana.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari nama atau kelas..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select
            value={filterRuangan}
            onChange={(e) => setFilterRuangan(e.target.value)}
          >
            <option value="">Semua Ruangan</option>
            <option>Aula Pratama</option>
            <option>Aula Madya</option>
            <option>Aula Jarkasi</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>

        </div>

        {/* ================= DESKTOP ================= */}

        <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl shadow-sm border">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-50 text-sm">

                <th className="text-left p-4">Nama</th>
                <th className="text-left">Kelas</th>
                <th className="text-left">Ruangan</th>
                <th className="text-left">Tanggal</th>
                <th className="text-left">Jam</th>
                <th className="text-left">Keperluan</th>
                <th className="text-left">Status</th>
                <th className="text-center">Aksi</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4 font-medium">
                    {item.nama}
                  </td>

                  <td>{item.kelas}</td>

                  <td>{item.ruangan}</td>

                  <td>{item.tanggal}</td>

                  <td>
                    {item.jam_mulai?.slice(0, 5)} -{' '}
                    {item.jam_selesai?.slice(0, 5)}
                  </td>

                  <td className="max-w-[250px]">

                    <div
                      className="truncate"
                      title={item.keperluan}
                    >
                      {item.keperluan}
                    </div>

                  </td>

                  <td>{statusBadge(item.status)}</td>

                  <td className="text-center">

                    <button
                      onClick={() => setSelected(item)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      Detail
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ================= MOBILE ================= */}

        <div className="lg:hidden space-y-4">

          {filtered.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border p-5"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-semibold text-lg">
                    {item.nama}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.kelas}
                  </p>

                </div>

                {statusBadge(item.status)}

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  <b>Ruangan :</b> {item.ruangan}
                </p>

                <p>
                  <b>Tanggal :</b> {item.tanggal}
                </p>

                <p>
                  <b>Jam :</b> {item.jam_mulai?.slice(0, 5)} -{' '}
                  {item.jam_selesai?.slice(0, 5)}
                </p>

                <p>
                  <b>Keperluan :</b>
                </p>

                <p className="text-slate-600">
                  {item.keperluan}
                </p>

              </div>

              <button
                onClick={() => setSelected(item)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
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

          <div className="bg-white rounded-2xl w-full max-w-xl p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Detail Peminjaman
              </h2>

              <button
                onClick={() => setSelected(null)}
              >
                <X />
              </button>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <p className="text-slate-500">Nama</p>
                <p>{selected.nama}</p>
              </div>

              <div>
                <p className="text-slate-500">Kelas</p>
                <p>{selected.kelas}</p>
              </div>

              <div>
                <p className="text-slate-500">Ruangan</p>
                <p>{selected.ruangan}</p>
              </div>

              <div>
                <p className="text-slate-500">Tanggal</p>
                <p>{selected.tanggal}</p>
              </div>

              <div>
                <p className="text-slate-500">Jam</p>
                <p>
                  {selected.jam_mulai} - {selected.jam_selesai}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Status</p>
                {statusBadge(selected.status)}
              </div>

            </div>

            <div className="mt-5">

              <p className="text-slate-500 mb-2">
                Keperluan
              </p>

              <div className="rounded-xl bg-slate-100 p-4">
                {selected.keperluan}
              </div>

            </div>

          </div>

        </div>

      )}
    </>
  );
}