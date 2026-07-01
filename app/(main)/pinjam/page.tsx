'use client';
import { useState, useTransition } from 'react';
import { createPeminjaman } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

const RUANGAN = ['Aula Pratama', 'Aula Madya', 'Aula Jarkasi'];

export default function FormPinjam() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  async function handleUpload(file: File) {
  setUploading(true);
  setError('');

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'pdf') {
    alert('Hanya file PDF yang diperbolehkan');
    setUploading(false);
    return;
  }

  // Bersihkan nama file
  let baseName = file.name.replace(/\.[^/.]+$/, '');
  baseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
  if (baseName.length === 0) baseName = 'file';
  const safePath = `${Date.now()}-${baseName}.pdf`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    alert('Konfigurasi Supabase tidak ditemukan');
    setUploading(false);
    return;
  }

  const url = `${supabaseUrl}/storage/v1/object/proposal/${safePath}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/pdf',
      },
      body: file,
    });

    if (!res.ok) {
      const errBody = await res.json();
      throw new Error(errBody.message || `HTTP ${res.status}`);
    }

    // Jika sukses, URL publik adalah sama
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/proposal/${safePath}`;
    setFileUrl(publicUrl);
    console.log('✅ Upload berhasil:', publicUrl);
  } catch (err: any) {
    console.error('❌ Upload error:', err);
    alert('Upload gagal: ' + err.message);
  } finally {
    setUploading(false);
  }
}

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (fileUrl) formData.set('file_url', fileUrl);
    startTransition(async () => {
      try {
        await createPeminjaman(formData);
        form.reset();
        setFileUrl('');
        router.push('/daftar');
      } catch (err: any) { setError(err.message); }
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Form Peminjaman Ruangan</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>}
        <div><label className="block text-sm font-medium mb-1">Nama Peminjam</label><input name="nama" required className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1">Kelas / Instansi</label><input name="kelas" required className="w-full border rounded-xl px-4 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Ruangan</label><select name="ruangan" required className="w-full border rounded-xl px-4 py-2"><option value="">Pilih Ruangan</option>{RUANGAN.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" name="tanggal" required className="w-full border rounded-xl px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Jam Mulai</label><input type="time" name="jam_mulai" required className="w-full border rounded-xl px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Jam Selesai</label><input type="time" name="jam_selesai" required className="w-full border rounded-xl px-4 py-2" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Keperluan</label><textarea name="keperluan" required rows={3} className="w-full border rounded-xl px-4 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Upload Surat/Proposal (PDF, opsional)</label>
          <input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
          {uploading && <span className="text-sm text-gray-500">Mengunggah...</span>}
        </div>
        <button type="submit" disabled={isPending || uploading} className="btn-primary w-full disabled:opacity-70">
          {isPending ? 'Menyimpan...' : 'Kirim Peminjaman'}
        </button>
      </form>
    </div>
  );
}
