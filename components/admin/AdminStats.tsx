import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Props {
  total: number;
  menunggu: number;
  disetujui: number;
  ditolak: number;
}

export default function AdminStats({
  total,
  menunggu,
  disetujui,
  ditolak,
}: Props) {
  const cards = [
    {
      title: "Total Peminjaman",
      value: total,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: CalendarDays,
    },
    {
      title: "Menunggu",
      value: menunggu,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: Clock3,
    },
    {
      title: "Disetujui",
      value: disetujui,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: CheckCircle2,
    },
    {
      title: "Ditolak",
      value: ditolak,
      color: "text-red-600",
      bg: "bg-red-50",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.bg} rounded-xl p-3`}
              >
                <Icon
                  className={card.color}
                  size={28}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}