"use client";

import {
  Check,
  X,
  Pencil,
  Trash2,
  FileText,
  Eye,
} from "lucide-react";


interface Props {
  data: any[];
  

  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onDetail: (item: any) => void;
}

export default function AdminMobileCards({
  data,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onDetail,
}: Props) {

  const badge = (status: string) => {
    if (status === "disetujui")
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Disetujui
        </span>
      );

    if (status === "ditolak")
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Ditolak
        </span>
      );

    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Menunggu
      </span>
    );
  };

  return (
    <div className="space-y-4 lg:hidden">

      {data.map((item) => (

        <div
          key={item.id}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >

          <div className="flex items-start justify-between">

            <div>

              <h3 className="font-semibold text-lg">
                {item.nama}
              </h3>

              <p className="text-sm text-slate-500">
                {item.kelas}
              </p>

            </div>

            {badge(item.status)}

          </div>

          <div className="mt-4 space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-slate-500">Ruangan</span>
              <span>{item.ruangan}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span>{item.tanggal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Jam</span>
              <span>
                {item.jam_mulai?.slice(0,5)}
                {" - "}
                {item.jam_selesai?.slice(0,5)}
              </span>
            </div>

            <div>

              <p className="text-slate-500 mb-1">
                Keperluan
              </p>

              <p className="rounded-lg bg-slate-50 p-2 text-sm">
                {item.keperluan}
              </p>

            </div>

          </div>

          {item.file_url && (

            <a
              href={item.file_url}
              target="_blank"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700"
            >
              <FileText size={16}/>
              Lihat Proposal
            </a>

          )}

          <div className="mt-5 flex flex-wrap gap-2">

            <button
              onClick={()=>onDetail(item)}
              className="rounded-lg border p-2 hover:bg-slate-100"
            >
              <Eye size={18}/>
            </button>

            {item.status==="menunggu" && (
              <>
                <button
                  onClick={()=>onApprove(item.id)}
                  className="rounded-lg bg-green-100 p-2 text-green-700"
                >
                  <Check size={18}/>
                </button>

                <button
                  onClick={()=>onReject(item.id)}
                  className="rounded-lg bg-red-100 p-2 text-red-700"
                >
                  <X size={18}/>
                </button>
              </>
            )}

            <button
              onClick={()=>onEdit(item)}
              className="rounded-lg bg-blue-100 p-2 text-blue-700"
            >
              <Pencil size={18}/>
            </button>

            <button
              onClick={()=>onDelete(item.id)}
              className="rounded-lg bg-gray-100 p-2"
            >
              <Trash2 size={18}/>
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}