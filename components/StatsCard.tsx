import { ReactNode } from "react";

interface Props {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}