'use client';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

export default function WeeklyCalendar({ events }: { events: any[] }) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Kalender Minggu Ini</h2>
      <div className="grid grid-cols-7 gap-1 min-w-[600px]">
        {days.map(day => (
          <div key={day.toString()} className="text-center border-r last:border-0">
            <div className={`text-sm font-medium py-2 ${isSameDay(day, today) ? 'bg-primary-100 text-primary-700 rounded-t-lg' : 'text-gray-500'}`}>
              {format(day, 'EEE', { locale: id })}<br/>{format(day, 'd')}
            </div>
            <div className="px-1 space-y-1 min-h-[80px]">
              {events.filter(e => isSameDay(new Date(e.tanggal), day)).slice(0,3).map(ev => (
                <div key={ev.id} className="text-xs bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded-md truncate" title={`${ev.ruangan} - ${ev.nama}`}>
                  {ev.jam_mulai.slice(0,5)} {ev.ruangan.split(' ')[1]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
