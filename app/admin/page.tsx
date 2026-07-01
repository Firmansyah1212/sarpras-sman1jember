import { getSemuaPeminjaman } from "@/lib/actions";
import AdminTable from "@/components/AdminTable";

export default async function AdminPage() {
  const data = await getSemuaPeminjaman();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel Admin - Kelola Peminjaman</h1>
      <AdminTable data={data} />
    </div>
  );
}
