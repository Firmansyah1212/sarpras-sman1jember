import { getSemuaPeminjaman } from "@/lib/actions";
import DaftarClient from "./DaftarClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DaftarPage() {
  const data = await getSemuaPeminjaman();

  return <DaftarClient data={data} />;
}