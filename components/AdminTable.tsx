'use client';

import { useMemo, useState } from 'react';

import {
  approvePeminjaman,
  rejectPeminjaman,
  deletePeminjaman,
  updatePeminjaman,
  getSemuaPeminjaman,
} from '@/lib/actions';

import {
  Search,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Pencil,
  Trash2,
  FileText,
  Building2,
} from 'lucide-react';

interface Props {
  data: any[];
}

export default function AdminTable({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);

  const [editing, setEditing] = useState<any>(null);

  const [selected, setSelected] = useState<any>(null);

  const [deleteItem, setDeleteItem] = useState<any>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  const [ruanganFilter, setRuanganFilter] = useState('');

  async function refresh() {
    const fresh = await getSemuaPeminjaman();
    setData(fresh);
  }

  const total = data.length;

  const menunggu = data.filter(
    (d) => d.status === 'menunggu'
  ).length;

  const disetujui = data.filter(
    (d) => d.status === 'disetujui'
  ).length;

  const ditolak = data.filter(
    (d) => d.status === 'ditolak'
  ).length;

  const filtered = useMemo(() => {
    return data.filter((item) => {

      const cocokSearch =
        item.nama
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.kelas
          .toLowerCase()
          .includes(search.toLowerCase());

      const cocokStatus =
        !statusFilter ||
        item.status === statusFilter;

      const cocokRuangan =
        !ruanganFilter ||
        item.ruangan === ruanganFilter;

      return (
        cocokSearch &&
        cocokStatus &&
        cocokRuangan
      );
    });
  }, [
    data,
    search,
    statusFilter,
    ruanganFilter,
  ]);

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!editing) return;

    setError('');

    const formData = new FormData(
      e.currentTarget
    );

    try {
      await updatePeminjaman(
        editing.id,
        formData
      );

      setEditing(null);

      await refresh();

    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      
  <>
    <div className="space-y-6">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Kelola Peminjaman
        </h1>

        <p className="mt-1 text-slate-500">
          Kelola seluruh pengajuan peminjaman sarana dan prasarana.
        </p>

      </div>

      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {total}
              </h2>
            </div>

            <CalendarDays
              size={34}
              className="text-blue-600"
            />

          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Menunggu
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                {menunggu}
              </h2>

            </div>

            <Clock3
              size={34}
              className="text-yellow-500"
            />

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Disetujui
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {disetujui}
              </h2>

            </div>

            <CheckCircle2
              size={34}
              className="text-green-600"
            />

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Ditolak
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {ditolak}
              </h2>

            </div>

            <XCircle
              size={34}
              className="text-red-600"
            />

          </div>

        </div>

      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm sticky top-5 z-20">

        <div className="grid gap-3 lg:grid-cols-3">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kelas..."
              className="pl-10"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">
              Semua Status
            </option>

            <option value="menunggu">
              Menunggu
            </option>

            <option value="disetujui">
              Disetujui
            </option>

            <option value="ditolak">
              Ditolak
            </option>

          </select>

          <select
            value={ruanganFilter}
            onChange={(e) => setRuanganFilter(e.target.value)}
          >
            <option value="">
              Semua Ruangan
            </option>

            <option value="Aula Pratama">
              Aula Pratama
            </option>

            <option value="Aula Madya">
              Aula Madya
            </option>

            <option value="Aula Jarkasi">
              Aula Jarkasi
            </option>

          </select>

        </div>

      </div>

    {/* ================= DESKTOP TABLE ================= */}

<div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm lg:block">

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-50">

        <tr className="text-left text-sm font-semibold text-slate-600">

          <th className="px-5 py-4">Nama</th>

          <th className="px-5 py-4">Kelas</th>

          <th className="px-5 py-4">Ruangan</th>

          <th className="px-5 py-4">Tanggal</th>

          <th className="px-5 py-4">Jam</th>

          <th className="px-5 py-4">Proposal</th>

          <th className="px-5 py-4">Status</th>

          <th className="px-5 py-4 text-center">
            Aksi
          </th>

        </tr>

      </thead>

      <tbody>

        {filtered.map((item) => (

          <tr
            key={item.id}
            className="border-t transition transition-all duration-200 hover:bg-blue-50"
          >

            <td className="px-5 py-4">

              <div>

                <p className="font-semibold">
                  {item.nama}
                </p>

                <p className="text-xs text-slate-500">
                  {item.keperluan}
                </p>

              </div>

            </td>

            <td className="px-5">
              {item.kelas}
            </td>

            <td className="px-5">
              {item.ruangan}
            </td>

            <td className="px-5 whitespace-nowrap">
              {item.tanggal}
            </td>

            <td className="px-5 whitespace-nowrap">
              {item.jam_mulai?.slice(0,5)}
              {" - "}
              {item.jam_selesai?.slice(0,5)}
            </td>

            <td className="px-5">

              {item.file_url ? (

                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700 transition hover:bg-blue-100"
                >

                  <FileText size={16}/>

                  Proposal

                </a>

              ) : (

                <span className="text-slate-400">
                  -
                </span>

              )}

            </td>

            <td className="px-5">

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 shadow-sm text-xs font-semibold ${
                  item.status === 'menunggu'
                    ? 'bg-yellow-100 text-yellow-700'
                    : item.status === 'disetujui'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >

                {item.status}

              </span>

            </td>

            <td className="px-5">

              <div className="flex justify-center gap-2">

                {item.status === 'menunggu' && (

                  <>

                    <button
                      onClick={async () => {
                        setLoadingId(item.id);
                        await approvePeminjaman(item.id);
                        await refresh();
                        setLoadingId(null);
                      }}
                      className="rounded-lg bg-green-50 p-2 text-green-700 hover:bg-green-100"
                    >

                      {loadingId === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent"/>
                      ) : (
                        <Check size={16}/>
                      )}

                    </button>

                    <button
                      onClick={async () => {
                        setLoadingId(item.id);
                        await rejectPeminjaman(item.id);
                        await refresh();
                        setLoadingId(null);
                      }}
                      className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100"
                    >

                      {loadingId === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent"/>
                      ) : (
                        <X size={16}/>
                      )}

                    </button>

                  </>

                )}

                <button
                  onClick={() => setEditing(item)}
                  className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                >
                  <Pencil size={16}/>
                </button>

                <button
                  onClick={() => setSelected(item)}
                  className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
                >
                  <Building2 size={16}/>
                </button>

                <button
                  onClick={() => setDeleteItem(item)}
                  className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                >
                  <Trash2 size={16}/>
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

{/* ================= MOBILE CARD ================= */}

<div className="space-y-4 lg:hidden">

  {filtered.map((item) => (

    <div
      key={item.id}
     className="rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-semibold">
            {item.nama}
          </h3>

          <p className="text-sm text-slate-500">
            {item.kelas}
          </p>

        </div>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1 shadow-sm text-xs font-semibold ${
            item.status === "menunggu"
              ? "bg-yellow-100 text-yellow-700"
              : item.status === "disetujui"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status}
        </span>

      </div>

      {/* Informasi */}
      <div className="mt-5 space-y-3">

        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Ruangan
          </span>

          <span className="font-medium">
            {item.ruangan}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Tanggal
          </span>

          <span className="font-medium">
            {item.tanggal}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Jam
          </span>

          <span className="font-medium">
            {item.jam_mulai?.slice(0,5)}
            {" - "}
            {item.jam_selesai?.slice(0,5)}
          </span>
        </div>

        <div>

          <p className="mb-1 text-sm text-slate-500">
            Keperluan
          </p>

          <p className="rounded-xl bg-slate-50 p-3 text-sm">
            {item.keperluan}
          </p>

        </div>

      </div>

            {item.file_url && (

        <a
          href={item.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100"
        >

          <FileText size={18}/>

          Lihat Proposal

        </a>

      )}

      <div className="mt-6 grid grid-cols-2 gap-2">

        {item.status === "menunggu" && (

          <>
            <button
              onClick={async () => {
                setLoadingId(item.id);
                await approvePeminjaman(item.id);
                await refresh();
                setLoadingId(null);
              }}
              className="rounded-xl bg-green-600 py-2 text-white"
            >
              Setujui
            </button>

            <button
              onClick={async () => {
                setLoadingId(item.id);
                await rejectPeminjaman(item.id);
                await refresh();
                setLoadingId(null);
              }}
              className="rounded-xl bg-red-600 py-2 text-white"
            >
              Tolak
            </button>
          </>

        )}

        <button
          onClick={() => setEditing(item)}
          className="rounded-xl bg-blue-600 py-2 text-white"
        >
          Edit
        </button>

        <button
          onClick={() => setSelected(item)}
          className="rounded-xl bg-slate-700 py-2 text-white"
        >
          Detail
        </button>

        <button
          onClick={() => setDeleteItem(item)}
          className="col-span-2 rounded-xl bg-gray-200 py-2 hover:bg-gray-300"
        >
          Hapus
        </button>

      </div>

    </div>

  ))}

</div>

{/* ================= DETAIL MODAL ================= */}

{selected && (

<div className="fixed inset-0 animate-in fade-in duration-200 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

  <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

    {/* Header */}

    <div className="flex items-center justify-between border-b p-6">

      <div>

        <h2 className="text-2xl font-bold">
          Detail Peminjaman
        </h2>

        <p className="text-sm text-slate-500">
          Informasi lengkap peminjaman ruangan
        </p>

      </div>

      <button
        onClick={() => setSelected(null)}
        className="rounded-xl bg-slate-100 px-3 py-2 hover:bg-slate-200"
      >
        ✕
      </button>

    </div>

    {/* Isi */}

    <div className="space-y-6 p-6">

      <div className="grid gap-5 sm:grid-cols-2">

        <div>

          <p className="text-sm text-slate-500">
            Nama
          </p>

          <p className="font-semibold">
            {selected.nama}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Kelas
          </p>

          <p className="font-semibold">
            {selected.kelas}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Ruangan
          </p>

          <p className="font-semibold">
            {selected.ruangan}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Tanggal
          </p>

          <p className="font-semibold">
            {selected.tanggal}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Jam
          </p>

          <p className="font-semibold">

            {selected.jam_mulai?.slice(0,5)}

            {" - "}

            {selected.jam_selesai?.slice(0,5)}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Status
          </p>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 shadow-sm text-sm font-semibold ${
              selected.status === "menunggu"
                ? "bg-yellow-100 text-yellow-700"
                : selected.status === "disetujui"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selected.status}
          </span>

        </div>

      </div>

            <div>

        <p className="mb-2 text-sm text-slate-500">
          Keperluan
        </p>

        <div className="rounded-2xl bg-slate-50 p-4 leading-relaxed">

          {selected.keperluan}

        </div>

      </div>

      {selected.file_url && (

        <a
          href={selected.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
        >

          <FileText size={18} />

          Lihat Proposal

        </a>

      )}

    </div>

    {/* Footer */}

    <div className="flex justify-end border-t p-6">

      <button
        onClick={() => setSelected(null)}
        className="rounded-xl bg-slate-200 px-6 py-2 font-medium transition hover:bg-slate-300"
      >
        Tutup
      </button>

    </div>

  </div>

</div>

)}

{/* ================= DELETE MODAL ================= */}

{deleteItem && (

<div className="fixed inset-0 animate-in fade-in duration-200 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

  <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">

    <div className="p-8 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

        <Trash2
          size={36}
          className="text-red-600"
        />

      </div>

      <h2 className="mt-6 text-2xl font-bold">

        Hapus Data?

      </h2>

      <p className="mt-3 text-slate-500">

        Data peminjaman

        <br />

        <b>{deleteItem.nama}</b>

        <br />

        akan dihapus permanen.

      </p>

      <div className="mt-8 flex gap-3">

        <button
          onClick={() => setDeleteItem(null)}
          className="flex-1 rounded-xl border py-3 font-medium"
        >
          Batal
        </button>

        <button
          onClick={async () => {

            setLoadingId(deleteItem.id);

            await deletePeminjaman(deleteItem.id);

            await refresh();

            setLoadingId(null);

            setDeleteItem(null);

          }}
          className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
        >

          {loadingId === deleteItem.id ? (

            <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

          ) : (

            "Hapus"

          )}

        </button>

      </div>

    </div>

  </div>

</div>

)}

{/* PART 7 */}

    </div>
  </>
    </>
  );
}