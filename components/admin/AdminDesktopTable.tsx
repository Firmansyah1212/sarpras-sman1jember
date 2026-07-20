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

export default function AdminDesktopTable({
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
    <div className="hidden lg:block overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="sticky top-0 bg-slate-100 text-sm">

            <tr>

              <th className="px-4 py-4 text-left">Nama</th>

              <th className="text-left">Kelas</th>

              <th className="text-left">Ruangan</th>

              <th className="text-left">Tanggal</th>

              <th className="text-left">Jam</th>

              <th className="text-left">Status</th>

              <th className="text-center">Proposal</th>

              <th className="text-center">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item) => (

              <tr
                key={item.id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="px-4 py-4 font-medium">
                  {item.nama}
                </td>

                <td>{item.kelas}</td>

                <td>{item.ruangan}</td>

                <td>{item.tanggal}</td>

                <td>
                  {item.jam_mulai?.slice(0,5)}
                  {" - "}
                  {item.jam_selesai?.slice(0,5)}
                </td>

                <td>{badge(item.status)}</td>

                <td className="text-center">

                  {item.file_url ? (

                    <a
                      href={item.file_url}
                      target="_blank"
                      className="inline-flex rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <FileText size={18}/>
                    </a>

                  ) : (

                    <span className="text-slate-400">
                      -
                    </span>

                  )}

                </td>

                <td>

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={()=>onDetail(item)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <Eye size={18}/>
                    </button>

                    {item.status==="menunggu" && (
                      <>
                        <button
                          onClick={()=>onApprove(item.id)}
                          className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200"
                        >
                          <Check size={16}/>
                        </button>

                        <button
                          onClick={()=>onReject(item.id)}
                          className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                        >
                          <X size={16}/>
                        </button>
                      </>
                    )}

                    <button
                      onClick={()=>onEdit(item)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                    >
                      <Pencil size={16}/>
                    </button>

                    <button
                      onClick={()=>onDelete(item.id)}
                      className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                    >
                      <Trash2 size={16}/>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}