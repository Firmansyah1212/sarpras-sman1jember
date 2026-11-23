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
    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

      <h2 className="mb-5 text-xl font-bold">
        Edit Peminjaman
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Nama Peminjam</label>
          <input
            name="nama"
            defaultValue={editing.nama ?? ""}
            required
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Asal Pemohon</label>
          <input
            name="asal_pemohon"
            defaultValue={editing.kelas ?? ""}
            required
            placeholder="Contoh: Guru, OSIS, Siswa Kelas X.1"
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ruangan / Tempat Dipinjam</label>
          <select
            name="ruangan"
            defaultValue={editing.ruangan ?? ""}
            required
            className="w-full rounded-xl border px-4 py-2"
          >
            <option value="">Pilih tempat</option>

            <optgroup label="Fasilitas">
              <option>Aula Pratama</option>
              <option>Aula Madya</option>
              <option>Aula Jarkasi</option>
              <option>Lab Komputer 1</option>
              <option>Lab Komputer 2</option>
              <option>Lab Komputer 3</option>
              <option>Lapangan</option>
              <option>Ruang Rapat</option>
            </optgroup>

            <optgroup label="Kelas X">
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i + 1}>X.{i + 1}</option>
              ))}
            </optgroup>

            <optgroup label="Kelas XI dan XII">
              <option>XI Humaniora</option>
              <option>XII Humaniora</option>
              <option>XI Kesehatan 1</option>
              <option>XI Kesehatan 2</option>
              <option>XI Kesehatan 3</option>
              <option>XII Kesehatan 1</option>
              <option>XII Kesehatan 2</option>
              <option>XII Kesehatan 3</option>
              <option>XI Teknik 1</option>
              <option>XI Teknik 2</option>
              <option>XII Teknik 1</option>
              <option>XII Teknik 2</option>
              <option>XII Teknik 3</option>
              <option>XI IPA 1</option>
              <option>XI IPA 2</option>
              <option>XI IPA 3</option>
              <option>XII IPA 1</option>
              <option>XII IPA 2</option>
              <option>XI IPS 1</option>
              <option>XI IPS 2</option>
              <option>XII IPS 1</option>
              <option>XII IPS 2</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            defaultValue={editing.tanggal ?? ""}
            required
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Jam Mulai</label>
            <input
              type="time"
              name="jam_mulai"
              defaultValue={editing.jam_mulai?.slice(0, 5) ?? ""}
              required
              className="w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Jam Selesai</label>
            <input
              type="time"
              name="jam_selesai"
              defaultValue={editing.jam_selesai?.slice(0, 5) ?? ""}
              required
              className="w-full rounded-xl border px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Keperluan</label>
          <textarea
            name="keperluan"
            defaultValue={editing.keperluan ?? ""}
            rows={4}
            required
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <input
          type="hidden"
          name="file_url"
          value={editing.file_url ?? ""}
          readOnly
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setError("");
            }}
            className="rounded-xl border px-5 py-2"
          >
            Batal
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Simpan Perubahan
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