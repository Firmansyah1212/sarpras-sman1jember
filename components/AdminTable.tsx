'use client';

import { useMemo, useState } from 'react';

import {
  approvePeminjaman,
  rejectPeminjaman,
  deletePeminjaman,
  updatePeminjaman,
} from '@/lib/actions';

import {
  Check,
  X,
  Trash2,
  Pencil,
  FileText,
  Search,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Building2,
} from 'lucide-react';

export default function AdminTable({
  data: initialData,
}: {
  data: any[];
}) {
const [data, setData] = useState(initialData);
const [editing, setEditing] = useState<any>(null);
const [error, setError] = useState('');
const [selected, setSelected] = useState<any>(null);
const [deleteItem, setDeleteItem] = useState<any>(null);
const [loadingId, setLoadingId] = useState<string | null>(null);
const [detailData, setDetailData] = useState<any>(null);
const [detailOpen, setDetailOpen] = useState(false);
const openDetail = (item: any) => {
  setDetailData(item);
  setDetailOpen(true);
};


const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [ruanganFilter, setRuanganFilter] = useState('');

  const refresh = async () => {
  const { getSemuaPeminjaman } = await import('@/lib/actions');
  const fresh = await getSemuaPeminjaman();
    setData(fresh);
  };

  const total = data.length;

const menunggu = data.filter(
  (i) => i.status === 'menunggu'
).length;

const disetujui = data.filter(
  (i) => i.status === 'disetujui'
).length;

const ditolak = data.filter(
  (i) => i.status === 'ditolak'
).length;

const filtered = useMemo(() => {
  return data.filter((item) => {

    const cocokSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase());

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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);

    try {
      await updatePeminjaman(editing.id, form);
      setEditing(null);
      refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
    <div className="mb-8">

  <h1 className="text-3xl font-bold">
    Kelola Peminjaman
  </h1>

  <p className="text-slate-500 mt-1">
    Kelola seluruh pengajuan peminjaman sarana dan prasarana.
  </p>

  <div className="grid gap-4 mt-6 sm:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-2xl border bg-white p-5 shadow-sm">

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
          className="text-blue-600"
          size={34}
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
          className="text-yellow-500"
          size={34}
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
          className="text-green-600"
          size={34}
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
          className="text-red-600"
          size={34}
        />

      </div>

    </div>

  </div>

  <div className="mt-6 grid gap-3 lg:grid-cols-3">

    <div className="relative">

      <Search
        className="absolute left-3 top-3 text-gray-400"
        size={18}
      />

      <input
        placeholder="Cari nama atau kelas..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="pl-10"
      />

    </div>

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
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
      onChange={(e) =>
        setRuanganFilter(e.target.value)
      }
    >
      <option value="">
        Semua Ruangan
      </option>

      <option>
        Aula Pratama
      </option>

      <option>
        Aula Madya
      </option>

      <option>
        Aula Jarkasi
      </option>

    </select>

  </div>

</div>
      <div className="hidden lg:block rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-2">Nama</th>
              <th>Kelas</th>
              <th>Ruangan</th>
              <th>Tanggal</th>
              <th>Jam</th>
              <th>Proposal</th>
              <th>Status</th>
              <th className="px-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
             <tr
key={item.id}
className="border-b transition hover:bg-slate-50"
>
                <td className="px-4 py-4 font-medium">
  {item.nama}
</td>

                <td>{item.kelas}</td>

                <td>{item.ruangan}</td>

                <td>{item.tanggal}</td>

                <td>
                  {item.jam_mulai?.slice(0, 5)} -{' '}
                  {item.jam_selesai?.slice(0, 5)}
                </td>

                <td>

{item.file_url ? (

<a
href={item.file_url}
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100"
>

<FileText size={16}/>

Proposal

</a>
                  ) : (
                    <span className="text-gray-400">
                      Tidak ada
                    </span>
                  )}
                </td>

                <td>
                 <span
className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === 'menunggu'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'disetujui'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-2">
                 <div className="flex items-center gap-2 justify-center">
                    {item.status === 'menunggu' && (
                      <>
                        <button
                         onClick={async () => {
  setLoadingId(item.id);

  await approvePeminjaman(item.id);

  await refresh();

  setLoadingId(null);
}}
className="rounded-lg bg-green-50 p-2 text-green-700 transition hover:bg-green-100"                        >
                         {loadingId === item.id ? (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
) : (
  <Check size={16} />
)}
                        </button>

                        <button
                          onClick={async () => {
  setLoadingId(item.id);

  await rejectPeminjaman(item.id);

  await refresh();

  setLoadingId(null);
}}
                          className="rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100"
                        >
                         {loadingId === item.id ? (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent" />
) : (
  <X size={16} />
)}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setEditing(item)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={async () => {
                        if (confirm('Hapus data ini?')) {
                          await deletePeminjaman(item.id);
                          refresh();
                        }
                      }}
                     className="rounded-lg bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-4 lg:hidden">

{filtered.map((item)=>(

<div
key={item.id}
className="rounded-2xl border bg-white p-5 shadow-sm"
>

<div className="flex justify-between">

<div>

<h3 className="font-semibold text-lg">

{item.nama}

</h3>

<p className="text-sm text-slate-500">

{item.kelas}

</p>

</div>

<span
className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
item.status==="menunggu"
?"bg-yellow-100 text-yellow-800"
:item.status==="disetujui"
?"bg-green-100 text-green-800"
:"bg-red-100 text-red-800"
}`}
>

{item.status}

</span>

</div>

<div className="mt-4 space-y-2 text-sm">

<p>

<b>Ruangan :</b>

{item.ruangan}

</p>

<p>

<b>Tanggal :</b>

{item.tanggal}

</p>

<p>

<b>Jam :</b>

{item.jam_mulai?.slice(0,5)} - {item.jam_selesai?.slice(0,5)}

</p>

{item.file_url &&(

<a
href={item.file_url}
target="_blank"
className="inline-flex items-center gap-2 text-blue-600"
>

<FileText size={18}/>

Proposal

</a>

)}

</div>

<div className="mt-5 flex gap-2">

{item.status==="menunggu"&&(

<>

<button
onClick={async()=>{
await approvePeminjaman(item.id);
refresh();
}}
className="flex-1 rounded-xl bg-green-600 py-2 text-white"
>

Setujui

</button>

<button
onClick={async()=>{
await rejectPeminjaman(item.id);
refresh();
}}
className="flex-1 rounded-xl bg-red-600 py-2 text-white"
>

Tolak

</button>

</>

)}

<button
onClick={()=>setEditing(item)}
className="flex-1 rounded-xl bg-blue-600 py-2 text-white"
> 

Edit

</button>
<button
  onClick={() => setSelected(item)}
  className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
>
  Detail
</button>

{deleteItem && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<button
  onClick={() => setSelected(item)}
  className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
>
  Detail
</button>

<div className="w-full max-w-md rounded-2xl bg-white p-6">

<h2 className="text-xl font-bold">

Hapus Data

</h2>

<p className="mt-3 text-slate-600">

Yakin ingin menghapus peminjaman

<b> {deleteItem.nama}</b>?

</p>

<div className="mt-6 flex justify-end gap-3">

<button
onClick={()=>setDeleteItem(null)}
className="rounded-xl border px-5 py-2"
>

Batal

</button>

<button
onClick={async()=>{

await deletePeminjaman(deleteItem.id);

setDeleteItem(null);

refresh();

}}

className="rounded-xl bg-red-600 px-5 py-2 text-white"

>

Hapus

</button>

</div>

</div>

</div>

)}


<button
onClick={async()=>{

setDeleteItem(item);

}}

className="rounded-xl bg-gray-200 px-4"

>

<Trash2 size={18}/>

</button>

</div>

</div>

))}

</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 mx-4">
            <h2 className="mb-4 text-xl font-bold">
              Edit Peminjaman
            </h2>

            <form
              onSubmit={handleUpdate}
              className="space-y-3"
            >
              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <input
                name="nama"
                defaultValue={editing.nama}
                required
                className="w-full rounded-xl border px-3 py-2"
              />

              <input
                name="kelas"
                defaultValue={editing.kelas}
                required
                className="w-full rounded-xl border px-3 py-2"
              />

              <select
                name="ruangan"
                defaultValue={editing.ruangan}
                required
                className="w-full rounded-xl border px-3 py-2"
              >
                <option>Aula Pratama</option>
                <option>Aula Madya</option>
                <option>Aula Jarkasi</option>
              </select>

              <input
                type="date"
                name="tanggal"
                defaultValue={editing.tanggal}
                required
                className="w-full rounded-xl border px-3 py-2"
              />

              <div className="flex gap-2">
                <input
                  type="time"
                  name="jam_mulai"
                  defaultValue={editing.jam_mulai}
                  required
                  className="w-full rounded-xl border px-3 py-2"
                />

                <input
                  type="time"
                  name="jam_selesai"
                  defaultValue={editing.jam_selesai}
                  required
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>
              

              <textarea
                name="keperluan"
                defaultValue={editing.keperluan}
                required
                className="w-full rounded-xl border px-3 py-2"
              />

              <input
                type="hidden"
                name="file_url"
                defaultValue={editing.file_url}
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="btn-outline"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
        
      )}
      
    </>
  );
  
}
