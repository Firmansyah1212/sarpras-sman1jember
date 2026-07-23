import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { getSemuaPeminjaman } from "@/lib/actions";
import AdminTable from "@/components/AdminTable";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const data = await getSemuaPeminjaman();

  return (
    <div className="space-y-6">
      {/* Tombol */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <a
            href="/api/download-proposal"
            className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            📥 Download Semua Proposal
          </a>

          <LogoutButton />
        </div>
      </div>

      {/* Tabel */}
      <AdminTable data={data} />
    </div>
  );
}