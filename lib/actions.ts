'use server'
import { supabaseAdmin } from './supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getPeminjamanHariIni() {
  const today = new Date().toISOString().slice(0,10)
  const { count } = await supabaseAdmin.from('peminjaman').select('*', { count: 'exact', head: true }).eq('tanggal', today).neq('status','ditolak')
  return count ?? 0
}

export async function getJadwalAktif() {
  const today = new Date().toISOString().slice(0,10)
  const { count } = await supabaseAdmin.from('peminjaman').select('*', { count: 'exact', head: true }).gte('tanggal', today).eq('status','disetujui')
  return count ?? 0
}

export async function getRuanganDigunakan() {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  const today = now.toISOString().slice(0, 10);

  const { data } = await supabaseAdmin
    .from('peminjaman')
    .select('ruangan')
    .eq('tanggal', today)
    .eq('status', 'disetujui')
    .lte('jam_mulai', time)
    .gte('jam_selesai', time);

  if (!data) return [];

  return Array.from(
    new Set(
      data.map((d: any) => d.ruangan)
    )
  );
}

export async function checkBentrok(ruangan: string, tanggal: string, jamMulai: string, jamSelesai: string, excludeId?: string) {
  let query = supabaseAdmin.from('peminjaman').select('id').eq('ruangan', ruangan).eq('tanggal', tanggal).neq('status','ditolak').lt('jam_mulai', jamSelesai).gt('jam_selesai', jamMulai);
  if (excludeId) query = query.neq('id', excludeId);
  const { data } = await query;
  return (data && data.length > 0) ? true : false;
}

export async function createPeminjaman(formData: FormData) {
  const nama = formData.get('nama') as string;
  const kelas = formData.get('kelas') as string;
  const ruangan = formData.get('ruangan') as string;
  const tanggal = formData.get('tanggal') as string;
  const jamMulai = formData.get('jam_mulai') as string;
  const jamSelesai = formData.get('jam_selesai') as string;
  const keperluan = formData.get('keperluan') as string;
  const fileUrl = formData.get('file_url') as string;
  if (!nama || !kelas || !ruangan || !tanggal || !jamMulai || !jamSelesai || !keperluan) throw new Error('Semua field wajib diisi');
  if (jamMulai >= jamSelesai) throw new Error('Jam selesai harus lebih besar dari jam mulai');
  const bentrok = await checkBentrok(ruangan, tanggal, jamMulai, jamSelesai);
  if (bentrok) throw new Error('Ruangan sudah dipakai pada jam tersebut, silakan pilih waktu lain.');
  const { error } = await supabaseAdmin.from('peminjaman').insert({ nama, kelas, ruangan, tanggal, jam_mulai: jamMulai, jam_selesai: jamSelesai, keperluan, file_url: fileUrl || null });
  if (error) throw new Error('Gagal menyimpan: ' + error.message);
  revalidatePath('/');
  revalidatePath('/daftar');
}

export async function getSemuaPeminjaman(filter?: { ruangan?: string; tanggal?: string; status?: string }) {
  let query = supabaseAdmin.from('peminjaman').select('*').order('tanggal', { ascending: true }).order('jam_mulai', { ascending: true });
  if (filter?.ruangan) query = query.eq('ruangan', filter.ruangan);
  if (filter?.tanggal) query = query.eq('tanggal', filter.tanggal);
  if (filter?.status) query = query.eq('status', filter.status);
  const { data } = await query;
  return data || [];
}

export async function approvePeminjaman(id: string) {
  await supabaseAdmin.from('peminjaman').update({ status: 'disetujui' }).eq('id', id);
  revalidatePath('/admin');
}
export async function rejectPeminjaman(id: string) {
  await supabaseAdmin.from('peminjaman').update({ status: 'ditolak' }).eq('id', id);
  revalidatePath('/admin');
}
export async function deletePeminjaman(id: string) {
  await supabaseAdmin.from('peminjaman').delete().eq('id', id);
  revalidatePath('/admin');
}
export async function updatePeminjaman(id: string, formData: FormData) {
  const ruangan = formData.get('ruangan') as string;
  const tanggal = formData.get('tanggal') as string;
  const jamMulai = formData.get('jam_mulai') as string;
  const jamSelesai = formData.get('jam_selesai') as string;
  const bentrok = await checkBentrok(ruangan, tanggal, jamMulai, jamSelesai, id);
  if (bentrok) throw new Error('Perubahan menyebabkan bentrok jadwal');
  const { error } = await supabaseAdmin.from('peminjaman').update({
    nama: formData.get('nama'),
    kelas: formData.get('kelas'),
    ruangan,
    tanggal,
    jam_mulai: jamMulai,
    jam_selesai: jamSelesai,
    keperluan: formData.get('keperluan'),
    file_url: formData.get('file_url') || null
  }).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin');
  
}
