import { LucideIcon } from "lucide-react";
interface Props { title: string; value: string | number; icon: LucideIcon; color?: string }
export default function StatsCard({ title, value, icon: Icon, color = "text-primary-600" }: Props) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-primary-50 ${color}`}><Icon size={28}/></div>
      <div><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
    </div>
  );
}
