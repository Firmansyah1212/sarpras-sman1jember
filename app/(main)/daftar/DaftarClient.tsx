'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function DaftarClient({ data }: { data: any[] }) {
  const [search, setSearch] = useState('');
  const [filterRuangan, setFilterRuangan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = data.filter(item => {
    return (
      (item.nama.toLowerCase().includes(search.toLowerCase()) || item.kelas.toLowerCase().includes(search.toLowerCase())) &&
      (!filterRuangan || item.ruangan === filterRuangan) &&
      (!filterStatus || item.status === filterStatus)
    );
  });

  const statusBadge = (status: string) => {
    const map: any = { menunggu: 'bg-yellow-100 text-yellow-800', disetujui: 'bg-green-100 text-green-800', ditolak: 'bg-red-100 text-red-800' };
    return <span className={`badge ${map[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Daftar Peminjaman</h1>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /><input type="text" placeholder="Cari nama atau kelas..." className="pl-10 border rounded-xl px-4 py-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select className="border rounded-xl px-4 py-2" value={filterRuangan} onChange={(e) => setFilterRuangan(e.target.value)}><option value="">Semua Ruangan</option><option>Aula Pratama</option><option>Aula Madya</option><option>Aula Jarkasi</option></select>
        <select className="border rounded-xl px-4 py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="">Semua Status</option><option value="menunggu">Menunggu</option><option value="disetujui">Disetujui</option><option value="ditolak">Ditolak</option></select>
      </div>
      <div className="overflow-x-auto card">
        <table className="w-full text-left">
          <thead><tr className="border-b text-sm text-gray-500"><th className="py-3 px-4">Nama</th><th>Kelas</th><th>Ruangan</th><th>Tanggal</th><th>Jam</th><th>Keperluan</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-4 font-medium">{item.nama}</td><td>{item.kelas}</td><td>{item.ruangan}</td><td>{item.tanggal}</td><td>{item.jam_mulai?.slice(0,5)} - {item.jam_selesai?.slice(0,5)}</td><td className="max-w-[200px] truncate">{item.keperluan}</td><td>{statusBadge(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
