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
    
    <div>
      <div className="mb-6 flex justify-end">
        <a
  href="/api/download-proposal"
  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
>
  📥 Download Semua Proposal
</a>
   <LogoutButton />
</div>



      <AdminTable data={data} />
    </div>
  );
}