import { getSemuaPeminjaman } from "@/lib/actions";
import DaftarClient from "./DaftarClient";

export default async function DaftarPage() {
  const data = await getSemuaPeminjaman();
  return <DaftarClient data={data} />;
}
