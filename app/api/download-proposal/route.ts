import { NextResponse } from "next/server";
import JSZip from "jszip";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("peminjaman")
      .select("nama, kelas, ruangan, tanggal, file_url")
      .not("file_url", "is", null);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const zip = new JSZip();

    const safe = (text: string) =>
      text.replace(/[\\/:*?"<>|]/g, "_");

    for (const item of data ?? []) {
      if (!item.file_url) continue;

      try {
        const res = await fetch(item.file_url);

        if (!res.ok) {
          console.log("File tidak ditemukan:", item.file_url);
          continue;
        }

        const arrayBuffer = await res.arrayBuffer();

        const filename =
          `${item.tanggal}_${safe(item.nama)}_${safe(item.kelas)}_${safe(item.ruangan)}.pdf`;

        zip.file(filename, arrayBuffer);
      } catch (err) {
        console.log("Gagal download:", item.file_url);
      }
    }

    const uint8 = await zip.generateAsync({
      type: "uint8array",
    });

   const body = new Uint8Array(uint8);

return new Response(body as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="Proposal_Peminjaman.zip"',
      },
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message ?? "Terjadi kesalahan.",
      },
      {
        status: 500,
      }
    );
  }
}