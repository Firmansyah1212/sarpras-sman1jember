'use client';

import { useMemo, useState } from 'react';

import {
  approvePeminjaman,
  rejectPeminjaman,
  deletePeminjaman,
  updatePeminjaman,
} from '@/lib/actions';

import AdminStats from './admin/AdminStats';
import AdminToolbar from './admin/AdminToolbar';
import AdminDesktopTable from './admin/AdminDesktopTable';
import AdminMobileCards from './admin/AdminMobileCards';
import DetailDialog from './admin/DetailDialog';

export default function AdminTable({
  data: initialData,
}: {
  data: any[];
}) {
  const [data, setData] = useState(initialData);

  const [editing, setEditing] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [rejectItem, setRejectItem] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ruanganFilter, setRuanganFilter] = useState('');

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [error, setError] = useState('');

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
    const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editing) return;

    setError('');

    const form = new FormData(e.currentTarget);

    try {
      await updatePeminjaman(editing.id, form);
      setEditing(null);
      await refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">

      <AdminStats
        total={total}
        menunggu={menunggu}
        disetujui={disetujui}
        ditolak={ditolak}
      />

      <AdminToolbar
        search={search}
        setSearch={setSearch}
        status={statusFilter}
        setStatus={setStatusFilter}
        ruangan={ruanganFilter}
        setRuangan={setRuanganFilter}
        onRefresh={refresh}
      />

      <AdminDesktopTable
  data={filtered}
  onApprove={async (id) => {
    setLoadingId(id);
    await approvePeminjaman(id);
    await refresh();
    setLoadingId(null);
  }}
  onReject={(id) => {
  const item = filtered.find((i) => i.id === id);
  if (item) {
    setRejectItem(item);
    setRejectReason("");
  }
}}
  onEdit={(item) => setEditing(item)}
  onDelete={(id) => {
    const item = filtered.find((i) => i.id === id);
    if (item) setDeleteItem(item);
  }}
  onDetail={(item) => setSelected(item)}
/>

<AdminMobileCards
  data={filtered}
  onApprove={async (id) => {
    setLoadingId(id);
    await approvePeminjaman(id);
    await refresh();
    setLoadingId(null);
  }}
  onReject={(id) => {
  const item = filtered.find((i) => i.id === id);
  if (item) {
    setRejectItem(item);
    setRejectReason("");
  }
}}
  onEdit={(item) => setEditing(item)}
  onDelete={(id) => {
    const item = filtered.find((i) => i.id === id);
    if (item) setDeleteItem(item);
  }}
  onDetail={(item) => setSelected(item)}
/>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="mb-5 text-xl font-bold">
              Edit Peminjaman
            </h2>

            <form
              onSubmit={handleUpdate}
              className="space-y-4"
            >

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <input
                name="nama"
                defaultValue={editing.nama}
                required
                className="w-full rounded-xl border px-4 py-2"
              />

              <input
                name="kelas"
                defaultValue={editing.kelas}
                required
                className="w-full rounded-xl border px-4 py-2"
              />

              <select
                name="ruangan"
                defaultValue={editing.ruangan}
                className="w-full rounded-xl border px-4 py-2"
              >
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

              <input
                type="date"
                name="tanggal"
                defaultValue={editing.tanggal}
                className="w-full rounded-xl border px-4 py-2"
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="time"
                  name="jam_mulai"
                  defaultValue={editing.jam_mulai}
                  className="rounded-xl border px-4 py-2"
                />

                <input
                  type="time"
                  name="jam_selesai"
                  defaultValue={editing.jam_selesai}
                  className="rounded-xl border px-4 py-2"
                />

              </div>

              <textarea
                name="keperluan"
                defaultValue={editing.keperluan}
                rows={4}
                className="w-full rounded-xl border px-4 py-2"
              />

              <input
                type="hidden"
                name="file_url"
                defaultValue={editing.file_url}
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border px-5 py-2"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-white"
                >
                  Simpan
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

            {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold">
              Hapus Data
            </h2>

            <p className="mt-3 text-slate-600">
              Yakin ingin menghapus
              <br />
              <b>{deleteItem.nama}</b> ?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setDeleteItem(null)}
                className="rounded-xl border px-5 py-2"
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
                className="rounded-xl bg-red-600 px-5 py-2 text-white"
              >
                Hapus
              </button>

            </div>

          </div>

        </div>
      )}
{rejectItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

      <h2 className="text-xl font-bold">
        Tolak Peminjaman
      </h2>

      <p className="mt-2 text-slate-500">
        Berikan alasan penolakan untuk
        <br />
        <b>{rejectItem.nama}</b>
      </p>

      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        rows={5}
        placeholder="Masukkan alasan penolakan..."
        className="mt-5 w-full rounded-xl border p-3"
      />

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => {
            setRejectItem(null);
            setRejectReason("");
          }}
          className="rounded-xl border px-5 py-2"
        >
          Batal
        </button>

        <button
          onClick={async () => {

            if (!rejectReason.trim()) {
              alert("Alasan penolakan wajib diisi.");
              return;
            }

            setLoadingId(rejectItem.id);

            await rejectPeminjaman(
              rejectItem.id,
              rejectReason
            );

            await refresh();

            setLoadingId(null);

            setRejectItem(null);

            setRejectReason("");

          }}
          className="rounded-xl bg-red-600 px-5 py-2 text-white"
        >
          Tolak
        </button>

      </div>

    </div>

  </div>
)}
      <DetailDialog
        open={selected !== null}
        data={selected}
        onClose={() => setSelected(null)}
        
      />

    </div>
  );
}