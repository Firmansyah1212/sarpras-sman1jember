export interface Peminjaman {
  id: string;
  nama: string;
  kelas: string;
  ruangan: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  keperluan: string;
  file_url?: string | null;
  status: "menunggu" | "disetujui" | "ditolak";
}