
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
    new Set((data || []).map((item) => item.ruangan).filter(Boolean))
  );
}

// ==========================================
// CEK BENTROK JADWAL
// ==========================================

export async function checkBentrok(
  jenis: 'kelas' | 'ruangan',
  target: string,
  tanggal: string,
  jamMulai: string,
  jamSelesai: string,
  excludeId?: string
) {
  let query = supabaseAdmin
    .from('peminjaman')
    .select('id')
    .eq('tanggal', tanggal)
    .neq('status', 'ditolak')
    .lt('jam_mulai', jamSelesai)
    .gt('jam_selesai', jamMulai);

  if (jenis === 'kelas') {
    query = query.eq('kelas', target);
  } else {
    query = query.eq('ruangan', target);
  }

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
  const kelas = (formData.get('kelas') as string)?.trim() || null;
  const ruangan = (formData.get('ruangan') as string)?.trim() || null;

  const tanggal = formData.get('tanggal') as string;
  const jamMulai = formData.get('jam_mulai') as string;
  const jamSelesai = formData.get('jam_selesai') as string;

  const keperluan = (formData.get('keperluan') as string)?.trim();

  // Validasi jenis peminjaman
  if (jenis !== 'kelas' && jenis !== 'ruangan') {
    throw new Error('Jenis peminjaman tidak valid.');
  }

  // Validasi data wajib
  if (!nama || !tanggal || !jamMulai || !jamSelesai || !keperluan) {
    throw new Error('Semua field wajib diisi.');
  }

  // Validasi pilihan target
  if (jenis === 'kelas') {
    if (!kelas || ruangan) {
      throw new Error('Silakan pilih kelas yang ingin dipinjam.');
    }
  }

  if (jenis === 'ruangan') {
    if (!ruangan || kelas) {
      throw new Error('Silakan pilih ruangan yang ingin dipinjam.');
    }
  }

  // Validasi waktu
  if (jamMulai >= jamSelesai) {
    throw new Error('Jam selesai harus lebih besar dari jam mulai.');
  }

  // Cek bentrok berdasarkan kelas atau ruangan
  const target = jenis === 'kelas' ? kelas : ruangan;

  const bentrok = await checkBentrok(
    jenis,
    target!,
    tanggal,
    jamMulai,
    jamSelesai
  );

  if (bentrok) {
    throw new Error(
      jenis === 'kelas'
        ? 'Kelas tersebut sudah digunakan pada tanggal dan jam yang dipilih.'
        : 'Ruangan sudah dipakai pada tanggal dan jam tersebut.'
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
  // ==========================================

  const { error } = await supabaseAdmin
    .from('peminjaman')
    .insert({
      nama,
      kelas: jenis === 'kelas' ? kelas : null,
      ruangan: jenis === 'ruangan' ? ruangan : null,
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
  const nama = formData.get('nama') as string;
  const kelas = (formData.get('kelas') as string)?.trim() || null;
  const ruangan = (formData.get('ruangan') as string)?.trim() || null;

  const tanggal = formData.get('tanggal') as string;
  const jamMulai = formData.get('jam_mulai') as string;
  const jamSelesai = formData.get('jam_selesai') as string;

  const keperluan = formData.get('keperluan') as string;

  if (!nama || !tanggal || !jamMulai || !jamSelesai || !keperluan) {
    throw new Error('Semua field wajib diisi.');
  }

  if (!kelas && !ruangan) {
    throw new Error('Kelas atau ruangan harus dipilih.');
  }

  if (kelas && ruangan) {
    throw new Error('Pilih kelas atau ruangan saja.');
  }

  if (jamMulai >= jamSelesai) {
    throw new Error('Jam selesai harus lebih besar dari jam mulai.');
  }

  const jenis: 'kelas' | 'ruangan' = kelas ? 'kelas' : 'ruangan';
  const target = kelas || ruangan;

  const bentrok = await checkBentrok(
    jenis,
    target!,
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
      kelas,
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
