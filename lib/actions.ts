
'use server';

import { supabaseAdmin } from './supabase/admin';
import { revalidatePath } from 'next/cache';

// ==========================================
// DASHBOARD
// ==========================================

export async function getPeminjamanHariIni() {
  const today = new Date().toISOString().slice(0, 10);

  const { count, error } = await supabaseAdmin
    .from('peminjaman')
    .select('*', { count: 'exact', head: true })
    .eq('tanggal', today)
    .neq('status', 'ditolak');

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function getJadwalAktif() {
  const today = new Date().toISOString().slice(0, 10);

  const { count, error } = await supabaseAdmin
    .from('peminjaman')
    .select('*', { count: 'exact', head: true })
    .gte('tanggal', today)
    .eq('status', 'disetujui');

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function getRuanganDigunakan() {
  const { data, error } = await supabaseAdmin
    .from('peminjaman')
    .select('ruangan')
    .not('ruangan', 'is', null)
    .order('ruangan', { ascending: true });

  if (error) throw new Error(error.message);

  return Array.from(
    new Set(
      (data || [])
        .map((item) => item.ruangan)
        .filter((room): room is string => Boolean(room))
    )
  );
}

// ==========================================
// CEK BENTROK JADWAL
// Semua target peminjaman menggunakan kolom ruangan
// ==========================================

export async function checkBentrok(
  jenis: 'kelas' | 'ruangan',
  target: string,
  tanggal: string,
  jamMulai: string,
  jamSelesai: string,
  excludeId?: string
) {
  // Parameter jenis dipertahankan agar kompatibel
  // dengan pemanggilan fungsi yang sudah ada.
  void jenis;

  let query = supabaseAdmin
    .from('peminjaman')
    .select('id')
    .eq('tanggal', tanggal)
    .eq('ruangan', target)
    .neq('status', 'ditolak')
    .lt('jam_mulai', jamSelesai)
    .gt('jam_selesai', jamMulai);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return Boolean(data && data.length > 0);
}

// ==========================================
// BUAT PEMINJAMAN BARU
// ==========================================

export async function createPeminjaman(formData: FormData) {
  const jenis = formData.get('jenis_peminjaman') as string;

  const nama = (formData.get('nama') as string)?.trim();
  const asalPemohon = (formData.get('asal_pemohon') as string)?.trim();

  const kelasDipinjam =
    (formData.get('kelas') as string)?.trim() || '';

  const ruanganDipinjam =
    (formData.get('ruangan') as string)?.trim() || '';

  const tanggal = formData.get('tanggal') as string;
  const jamMulai = formData.get('jam_mulai') as string;
  const jamSelesai = formData.get('jam_selesai') as string;

  const keperluan = (formData.get('keperluan') as string)?.trim();

  if (jenis !== 'kelas' && jenis !== 'ruangan') {
    throw new Error('Jenis peminjaman tidak valid.');
  }

  if (
    !nama ||
    !asalPemohon ||
    !tanggal ||
    !jamMulai ||
    !jamSelesai ||
    !keperluan
  ) {
    throw new Error('Semua field wajib diisi.');
  }

  // Tentukan tempat yang dipinjam
  const targetDipinjam =
    jenis === 'kelas' ? kelasDipinjam : ruanganDipinjam;

  if (!targetDipinjam) {
    throw new Error(
      jenis === 'kelas'
        ? 'Silakan pilih kelas yang ingin dipinjam.'
        : 'Silakan pilih ruangan yang ingin dipinjam.'
    );
  }

  if (jenis === 'kelas' && ruanganDipinjam) {
    throw new Error('Data peminjaman tidak valid.');
  }

  if (jenis === 'ruangan' && kelasDipinjam) {
    throw new Error('Data peminjaman tidak valid.');
  }

  if (jamMulai >= jamSelesai) {
    throw new Error('Jam selesai harus lebih besar dari jam mulai.');
  }

  // Semua pengecekan menggunakan kolom ruangan
  const bentrok = await checkBentrok(
    jenis,
    targetDipinjam,
    tanggal,
    jamMulai,
    jamSelesai
  );

  if (bentrok) {
    throw new Error(
      'Kelas atau ruangan tersebut sudah digunakan pada tanggal dan jam yang dipilih.'
    );
  }

  // ==========================================
  // UPLOAD FILE PROPOSAL
  // ==========================================

  let fileUrl: string | null = null;

  const file = formData.get('file_url') as File | null;

  if (file && file.size > 0) {
    if (file.type !== 'application/pdf') {
      throw new Error('File harus berformat PDF.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Ukuran file maksimal 5MB.');
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('proposal')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseAdmin.storage
      .from('proposal')
      .getPublicUrl(fileName);

    fileUrl = data.publicUrl;
  }

  // ==========================================
  // SIMPAN KE DATABASE
  // kelas = asal pemohon
  // ruangan = tempat yang dipinjam
  // ==========================================

  const { error } = await supabaseAdmin
    .from('peminjaman')
    .insert({
      nama,
      kelas: asalPemohon,
      ruangan: targetDipinjam,
      tanggal,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      keperluan,
      file_url: fileUrl,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/daftar');
}

// ==========================================
// AMBIL SEMUA DATA PEMINJAMAN
// ==========================================

export async function getSemuaPeminjaman(
  filter?: {
    ruangan?: string;
    tanggal?: string;
    status?: string;
  }
) {
  let query = supabaseAdmin
    .from('peminjaman')
    .select('*')
    .order('tanggal', { ascending: true })
    .order('jam_mulai', { ascending: true });

  if (filter?.ruangan) {
    query = query.eq('ruangan', filter.ruangan);
  }

  if (filter?.tanggal) {
    query = query.eq('tanggal', filter.tanggal);
  }

  if (filter?.status) {
    query = query.eq('status', filter.status);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data || [];
}

// ==========================================
// SETUJUI PEMINJAMAN
// ==========================================

export async function approvePeminjaman(id: string) {
  const { error } = await supabaseAdmin
    .from('peminjaman')
    .update({ status: 'disetujui' })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/daftar');
}

// ==========================================
// TOLAK PEMINJAMAN
// ==========================================

export async function rejectPeminjaman(
  id: string,
  alasan: string
) {
  const { error } = await supabaseAdmin
    .from('peminjaman')
    .update({
      status: 'ditolak',
      alasan_penolakan: alasan,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/daftar');
}

// ==========================================
// HAPUS PEMINJAMAN
// ==========================================

export async function deletePeminjaman(id: string) {
  const { error } = await supabaseAdmin
    .from('peminjaman')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/daftar');
}

// ==========================================
// UPDATE PEMINJAMAN
// ==========================================

export async function updatePeminjaman(
  id: string,
  formData: FormData
) {
  const nama = (formData.get('nama') as string)?.trim();
  const asalPemohon = (formData.get('asal_pemohon') as string)?.trim();
  const ruangan = (formData.get('ruangan') as string)?.trim();

  const tanggal = formData.get('tanggal') as string;
  const jamMulai = formData.get('jam_mulai') as string;
  const jamSelesai = formData.get('jam_selesai') as string;

  const keperluan = (formData.get('keperluan') as string)?.trim();

  if (
    !nama ||
    !asalPemohon ||
    !ruangan ||
    !tanggal ||
    !jamMulai ||
    !jamSelesai ||
    !keperluan
  ) {
    throw new Error('Semua field wajib diisi.');
  }

  if (jamMulai >= jamSelesai) {
    throw new Error('Jam selesai harus lebih besar dari jam mulai.');
  }

  const bentrok = await checkBentrok(
    'ruangan',
    ruangan,
    tanggal,
    jamMulai,
    jamSelesai,
    id
  );

  if (bentrok) {
    throw new Error('Perubahan menyebabkan bentrok jadwal.');
  }

  const { error } = await supabaseAdmin
    .from('peminjaman')
    .update({
      nama,
      kelas: asalPemohon,
      ruangan,
      tanggal,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      keperluan,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/daftar');
}
