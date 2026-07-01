'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function AdminTable({
  data: initialData,
}: {
  data: any[];
}) {
  const [data, setData] = useState(initialData);
  const [editing, setEditing] = useState<any>(null);
  const [error, setError] = useState('');

  const refresh = async () => {
    const { getSemuaPeminjaman } = await import('@/lib/actions');
    const fresh = await getSemuaPeminjaman();
    setData(fresh);
  };

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
      <div className="card overflow-x-auto">
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
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-2 px-2">{item.nama}</td>

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
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <FileText size={16} />
                      Lihat PDF
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      Tidak ada
                    </span>
                  )}
                </td>

                <td>
                  <span
                    className={`badge ${
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
                  <div className="flex gap-1">
                    {item.status === 'menunggu' && (
                      <>
                        <button
                          onClick={async () => {
                            await approvePeminjaman(item.id);
                            refresh();
                          }}
                          className="p-1 rounded text-green-600 hover:bg-green-50"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          onClick={async () => {
                            await rejectPeminjaman(item.id);
                            refresh();
                          }}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setEditing(item)}
                      className="p-1 rounded text-blue-600 hover:bg-blue-50"
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
                      className="p-1 rounded text-gray-600 hover:bg-gray-100"
                    >
                      <Trash2 size={16} />
                    </button>
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