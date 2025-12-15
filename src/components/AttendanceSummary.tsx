import { useState } from 'react';
import { Attendance, MonthlyAttendance } from '@/types/student';
import { CalendarCheck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AttendanceCalendar } from './AttendanceCalendar';

interface AttendanceSummaryProps {
  attendance: Attendance[];
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number } | null>(null);

  const getMonthlyAttendance = (): MonthlyAttendance[] => {
    const monthlyData: Record<string, MonthlyAttendance> = {};

    attendance.forEach(a => {
      const date = new Date(a.tanggal);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          bulan: MONTH_NAMES[month],
          tahun: year,
          hadir: 0,
          sakit: 0,
          izin: 0
        };
      }

      switch (a.status) {
        case 'Hadir':
          monthlyData[key].hadir++;
          break;
        case 'Sakit':
          monthlyData[key].sakit++;
          break;
        case 'Izin':
          monthlyData[key].izin++;
          break;
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      const monthA = MONTH_NAMES.indexOf(a.bulan);
      const monthB = MONTH_NAMES.indexOf(b.bulan);
      if (a.tahun !== b.tahun) return b.tahun - a.tahun;
      return monthB - monthA;
    });
  };

  const monthlyAttendance = getMonthlyAttendance();

  const handleMonthClick = (bulan: string, tahun: number) => {
    const monthIndex = MONTH_NAMES.indexOf(bulan);
    setSelectedMonth({ month: monthIndex, year: tahun });
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <CalendarCheck className="w-5 h-5 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Rekap Kehadiran</h3>
      </div>

      {monthlyAttendance.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Bulan</TableHead>
                <TableHead className="text-center font-semibold text-success">Hadir</TableHead>
                <TableHead className="text-center font-semibold text-warning">Sakit</TableHead>
                <TableHead className="text-center font-semibold text-info">Izin</TableHead>
                <TableHead className="text-center font-semibold text-purple">Tambahan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {monthlyAttendance.map((month) => (
    <div
      key={`${month.bulan}-${month.tahun}`}
      className="border rounded-lg p-4 hover:shadow transition"
    >
      <div
        className="font-semibold text-lg cursor-pointer hover:text-primary hover:underline"
        onClick={() => handleMonthClick(month.bulan, month.tahun)}
      >
        {month.bulan} {month.tahun}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        {/* Hadir */}
        <div>
          <div className="text-success font-bold text-xl">
            {month.hadir}
          </div>
          <div className="text-sm text-muted-foreground">Hadir</div>
        </div>

        {/* Sakit */}
        <div>
          <div className="text-warning font-bold text-xl">
            {month.sakit}
          </div>
          <div className="text-sm text-muted-foreground">Sakit</div>
        </div>

        {/* Izin */}
        <div>
          <div className="text-info font-bold text-xl">
            {month.izin}
          </div>
          <div className="text-sm text-muted-foreground">Izin</div>
        </div>
      </div>
    </div>
  ))}
</div>

            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Belum ada data kehadiran
        </div>
      )}

      {/* Calendar Dialog */}
      {selectedMonth && (
        <AttendanceCalendar
          isOpen={!!selectedMonth}
          onClose={() => setSelectedMonth(null)}
          month={selectedMonth.month}
          year={selectedMonth.year}
          attendance={attendance}
        />
      )}
    </div>
  );
}
