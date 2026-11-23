
'use client';

import { useState } from 'react';
import { createPeminjaman } from '@/lib/actions';

type JenisPeminjaman = 'kelas' | 'ruangan';

interface FormData {
  jenis_peminjaman: JenisPeminjaman;
  nama: string;
  kelas: string;
  ruangan: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  keperluan: string;
  file: File | null;
}

const initialFormData: FormData = {
  jenis_peminjaman: 'ruangan',
  nama: '',
  kelas: '',
  ruangan: '',
  tanggal: '',
  jam_mulai: '',
  jam_selesai: '',
  keperluan: '',
  file: null,
};

export default function FormPeminjaman() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fileName, setFileName] = useState('Tidak ada file dipilih');
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleJenisChange = (jenis: JenisPeminjaman) => {
    setFormData((prev) => ({
      ...prev,
      jenis_peminjaman: jenis,
      kelas: '',
      ruangan: '',
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'File harus berformat PDF.' });
      e.target.value = '';
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Ukuran file maksimal 5MB.' });
      e.target.value = '';
      return;
    }

    setStatus({ type: null, message: '' });
    setFormData((prev) => ({ ...prev, file }));
    setFileName(file ? file.name : 'Tidak ada file dipilih');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('jenis_peminjaman', formData.jenis_peminjaman);
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('kelas', formData.jenis_peminjaman === 'kelas' ? formData.kelas : '');
      formDataToSend.append('ruangan', formData.jenis_peminjaman === 'ruangan' ? formData.ruangan : '');
      formDataToSend.append('tanggal', formData.tanggal);
      formDataToSend.append('jam_mulai', formData.jam_mulai);
      formDataToSend.append('jam_selesai', formData.jam_selesai);
      formDataToSend.append('keperluan', formData.keperluan);

      if (formData.file) {
        formDataToSend.append('file_url', formData.file);
      }

      await createPeminjaman(formDataToSend);

      setStatus({
        type: 'success',
        message: 'Peminjaman berhasil dikirim.',
      });

      setFormData(initialFormData);
      setFileName('Tidak ada file dipilih');

      const fileInput = document.getElementById('file') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        window.location.href = '/daftar';
      }, 1200);
    } catch (err: unknown) {
      console.error('ERROR PEMINJAMAN:', err);

      setStatus({
        type: 'error',
        message: err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengirim data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
            </svg>
          </span>
          Form Peminjaman Sarana
        </h2>
        <p className="text-gray-500 mt-1 ml-2">
          Isi data dengan lengkap untuk pengajuan peminjaman kelas atau ruangan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {status.type && (
          <div className={`p-4 rounded-lg text-sm ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}

        {/* Jenis peminjaman */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Peminjaman <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleJenisChange('kelas')}
              className={`p-4 rounded-xl border-2 text-left transition ${
                formData.jenis_peminjaman === 'kelas'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
              }`}
            >
              <span className="block font-bold">Pinjam Kelas</span>
              <span className="block text-sm mt-1 opacity-75">
                Untuk penggunaan kelas atau ruang belajar
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleJenisChange('ruangan')}
              className={`p-4 rounded-xl border-2 text-left transition ${
                formData.jenis_peminjaman === 'ruangan'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
              }`}
            >
              <span className="block font-bold">Pinjam Ruangan</span>
              <span className="block text-sm mt-1 opacity-75">
                Untuk penggunaan aula, laboratorium, dan fasilitas lainnya
              </span>
            </button>
          </div>
        </div>

        {/* Nama dan pilihan kelas/ruangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Peminjam <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className={inputClass}
            />
          </div>

          {formData.jenis_peminjaman === 'kelas' ? (
            <div>
              <label htmlFor="kelas" className="block text-sm font-semibold text-gray-700 mb-1">
                Kelas / Instansi <span className="text-red-500">*</span>
              </label>
              <select
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Pilih Kelas / Instansi</option>

                <optgroup label="Kelas X">
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={`X.${i + 1}`} value={`X.${i + 1}`}>
                      X.{i + 1}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Kelas XI dan XII">
                  <option value="XI Humaniora">XI Humaniora</option>
                  <option value="XII Humaniora">XII Humaniora</option>
                  <option value="XI Kesehatan 1">XI Kesehatan 1</option>
                  <option value="XI Kesehatan 2">XI Kesehatan 2</option>
                  <option value="XI Kesehatan 3">XI Kesehatan 3</option>
                  <option value="XII Kesehatan 1">XII Kesehatan 1</option>
                  <option value="XII Kesehatan 2">XII Kesehatan 2</option>
                  <option value="XII Kesehatan 3">XII Kesehatan 3</option>
                  <option value="XI Teknik 1">XI Teknik 1</option>
                  <option value="XI Teknik 2">XI Teknik 2</option>
                  <option value="XII Teknik 1">XII Teknik 1</option>
                  <option value="XII Teknik 2">XII Teknik 2</option>
                  <option value="XII Teknik 3">XII Teknik 3</option>
                  <option value="XI IPA 1">XI IPA 1</option>
                  <option value="XI IPA 2">XI IPA 2</option>
                  <option value="XI IPA 3">XI IPA 3</option>
                  <option value="XII IPA 1">XII IPA 1</option>
                  <option value="XII IPA 2">XII IPA 2</option>
                  <option value="XI IPS 1">XI IPS 1</option>
                  <option value="XI IPS 2">XI IPS 2</option>
                  <option value="XII IPS 1">XII IPS 1</option>
                  <option value="XII IPS 2">XII IPS 2</option>
                </optgroup>

                <optgroup label="Lainnya">
                  <option value="OSIS">OSIS</option>
                  <option value="Lainnya">Lainnya</option>
                </optgroup>
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="ruangan" className="block text-sm font-semibold text-gray-700 mb-1">
                Ruangan <span className="text-red-500">*</span>
              </label>
              <select
                id="ruangan"
                name="ruangan"
                value={formData.ruangan}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Pilih Ruangan</option>
                <option value="Aula Pratama">Aula Pratama</option>
                <option value="Aula Madya">Aula Madya</option>
                <option value="Aula Jarkasi">Aula Jarkasi</option>
                <option value="Lab Komputer 1">Lab Komputer 1</option>
                <option value="Lab Komputer 2">Lab Komputer 2</option>
                <option value="Lab Komputer 3">Lab Komputer 3</option>
                <option value="Lapangan">Lapangan</option>
                <option value="Ruang Rapat">Ruang Rapat</option>
              </select>
            </div>
          )}
        </div>

        {/* Tanggal dan waktu */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="tanggal" className="block text-sm font-semibold text-gray-700 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="jam_mulai" className="block text-sm font-semibold text-gray-700 mb-1">
              Jam Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="jam_mulai"
              name="jam_mulai"
              value={formData.jam_mulai}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="jam_selesai" className="block text-sm font-semibold text-gray-700 mb-1">
              Jam Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="jam_selesai"
              name="jam_selesai"
              value={formData.jam_selesai}
              onChange={handleChange}
              required
              min={formData.jam_mulai || undefined}
              className={inputClass}
            />
          </div>
        </div>

        {/* Keperluan */}
        <div>
          <label htmlFor="keperluan" className="block text-sm font-semibold text-gray-700 mb-1">
            Keperluan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="keperluan"
            name="keperluan"
            value={formData.keperluan}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Jelaskan keperluan peminjaman secara singkat"
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Upload proposal */}
        <div>
          <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-1">
            Upload Surat / Proposal
            <span className="ml-2 text-xs font-normal text-gray-400">(PDF, opsional)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="flex-1 w-full">
              <input
                type="file"
                id="file"
                name="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-400">
                Format PDF, maksimal 5MB
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
            {loading ? 'Memproses...' : 'Kirim Peminjaman'}
          </button>
          <p className="mt-3 text-sm text-gray-400">* Field wajib diisi</p>
        </div>
      </form>
    </div>
  );
}
