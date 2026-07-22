// components/FormPeminjaman.tsx
'use client';

import { useState } from 'react';
import { createPeminjaman } from '@/lib/actions'; // ← import server action

interface FormData {
  nama: string;
  kelas: string;
  ruangan: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  keperluan: string;
  file: File | null;
}

export default function FormPeminjaman() {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    kelas: '',
    ruangan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    keperluan: '',
    file: null,
  });
  const [fileName, setFileName] = useState('Tidak ada file dipilih');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
    setFileName(file ? file.name : 'Tidak ada file dipilih');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted, memanggil createPeminjaman...');
    console.log('📝 Data yang dikirim:', formData);

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Buat FormData untuk dikirim ke server action
      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('kelas', formData.kelas);
      formDataToSend.append('ruangan', formData.ruangan);
      formDataToSend.append('tanggal', formData.tanggal);
      formDataToSend.append('jam_mulai', formData.jam_mulai);
      formDataToSend.append('jam_selesai', formData.jam_selesai);
      formDataToSend.append('keperluan', formData.keperluan);
      if (formData.file) {
        formDataToSend.append('file_url', formData.file);
      }

      console.log('📤 Mengirim ke server action...');
      await createPeminjaman(formDataToSend);
      console.log('✅ createPeminjaman selesai tanpa error');

      setStatus({ type: 'success', message: 'Peminjaman berhasil dikirim! Redirecting...' });
      
      // Reset form setelah sukses (opsional)
      setFormData({
        nama: '',
        kelas: '',
        ruangan: '',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: '',
        keperluan: '',
        file: null,
      });
      setFileName('Tidak ada file dipilih');

      // Redirect setelah 1 detik (karena redirect sudah ditangani di server action, tapi sebagai fallback)
      setTimeout(() => {
        window.location.href = '/daftar';
      }, 1000);

    } catch (error: any) {
      console.log('❌ Error di form:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Terjadi kesalahan saat mengirim peminjaman.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>
          Form Peminjaman Ruangan
        </h2>
        <p className="text-gray-500 mt-1 ml-2">Isi data dengan lengkap untuk pengajuan peminjaman sarana dan prasarana.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notifikasi */}
        {status.type && (
          <div className={`p-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.message}
          </div>
        )}

        {/* Grid 2 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Peminjam <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="kelas" className="block text-sm font-semibold text-gray-700 mb-1">
              Kelas / Instansi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <input
                type="text"
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
                placeholder="Contoh: XII TEK 3 / OSIS"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="ruangan" className="block text-sm font-semibold text-gray-700 mb-1">
            Ruangan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
              </svg>
            </span>
            <select
              id="ruangan"
              name="ruangan"
              value={formData.ruangan}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition"
            >
              <option value="">Pilih Ruangan</option>
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
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="tanggal" className="block text-sm font-semibold text-gray-700 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="jam_mulai" className="block text-sm font-semibold text-gray-700 mb-1">
              Jam Mulai <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
                type="time"
                id="jam_mulai"
                name="jam_mulai"
                value={formData.jam_mulai}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="jam_selesai" className="block text-sm font-semibold text-gray-700 mb-1">
              Jam Selesai <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
                type="time"
                id="jam_selesai"
                name="jam_selesai"
                value={formData.jam_selesai}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="keperluan" className="block text-sm font-semibold text-gray-700 mb-1">
            Keperluan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            <textarea
              id="keperluan"
              name="keperluan"
              value={formData.keperluan}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Jelaskan keperluan peminjaman ruangan secara singkat"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-y"
            />
          </div>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-1">
            Upload Surat / Proposal
            <span className="ml-2 text-xs font-normal text-gray-400">(PDF, opsional)</span>
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex-1 w-full">
              <input
                type="file"
                id="file"
                name="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-400">
                <i className="fas fa-info-circle"></i> Format PDF, maksimal 5MB
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
              <span className="font-medium">{fileName}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-lg disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Kirim Peminjaman
              </>
            )}
          </button>
          <p className="mt-3 text-sm text-gray-400">* Field wajib diisi</p>
        </div>
      </form>
    </div>
  );
}