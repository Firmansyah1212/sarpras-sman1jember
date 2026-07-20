"use client";

import { Search, RotateCw } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  ruangan: string;
  setRuangan: (value: string) => void;

  onRefresh: () => void;
}

export default function AdminToolbar({
  search,
  setSearch,
  status,
  setStatus,
  ruangan,
  setRuangan,
  onRefresh,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-4">

        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, kelas, keperluan..."
            className="w-full rounded-xl border pl-10 pr-4 py-2.5"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border px-3 py-2.5"
        >
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>

        {/* Ruangan */}
        <select
          value={ruangan}
          onChange={(e) => setRuangan(e.target.value)}
          className="rounded-xl border px-3 py-2.5"
        >
          <option value="">Semua Ruangan</option>
          <option>Aula Pratama</option>
          <option>Aula Madya</option>
          <option>Aula Jarkasi</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <RotateCw size={16} />
          Refresh Data
        </button>
      </div>
    </div>
  );
}