"use client";

import { X, FileText } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any | null;
}

export default function DetailDialog({
  open,
  onClose,
  data,
}: Props) {
  if (!open || !data) return null;

  const badge = () => {
    switch (data.status) {
      case "disetujui":
        return (
          <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
            Disetujui
          </span>
        );

      case "ditolak":
        return (
          <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">
            Ditolak
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-semibold text-yellow-700">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Detail Peminjaman
            </h2>

            <p className="text-sm text-slate-500">
              Informasi lengkap peminjaman ruangan
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X />
          </button>

        </div>

        {/* Body */}
        <div className="grid gap-4 p-6 md:grid-cols-2">

          <Info label="Nama" value={data.nama} />
          <Info label="Kelas" value={data.kelas} />

          <Info label="Ruangan" value={data.ruangan} />
          <Info label="Tanggal" value={data.tanggal} />

          <Info
            label="Jam"
            value={`${data.jam_mulai?.slice(0,5)} - ${data.jam_selesai?.slice(0,5)}`}
          />

          <div>
            <p className="text-sm text-slate-500 mb-1">
              Status
            </p>

            {badge()}
          </div>

          <div className="md:col-span-2">

            <p className="text-sm text-slate-500 mb-1">
              Keperluan
            </p>

            <div className="rounded-xl bg-slate-50 p-4 leading-relaxed">
              {data.keperluan}
            </div>

          </div>

          {data.file_url && (

            <div className="md:col-span-2">

              <a
                href={data.file_url}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
              >
                <FileText size={18} />
                Lihat Proposal PDF
              </a>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="mb-1 text-sm text-slate-500">
        {label}
      </p>

      <div className="rounded-xl border bg-slate-50 p-3">
        {value}
      </div>

    </div>
  );
}