/**
 * Deterministic mock data for the Attendance page (daily overview).
 * Used until biometric/attendance backend is wired.
 */

export type AttendanceEventType = "check-in" | "check-out";

export type AttendanceEvent = {
  id: string;
  employeeName: string;
  type: AttendanceEventType;
  time: string;
  role?: string;
};

export type TodaySummary = {
  expected: number;
  present: number;
  label: string;
};

/** Mock today summary for the attendance dashboard. */
export const todayAttendanceSummary: TodaySummary = {
  expected: 8,
  present: 6,
  label: "Today",
};

/** Mock recent check-in/check-out events (deterministic). */
export const recentAttendanceEvents: AttendanceEvent[] = [
  { id: "ev-1", employeeName: "Mara Bautista", type: "check-in", time: "5:11 AM", role: "Coach" },
  { id: "ev-2", employeeName: "Lance Navarro", type: "check-in", time: "6:32 AM", role: "Front Desk" },
  { id: "ev-3", employeeName: "Serena Uy", type: "check-in", time: "9:54 AM", role: "Operations" },
  { id: "ev-4", employeeName: "Theo Alvarez", type: "check-in", time: "10:02 AM", role: "Maintenance" },
  { id: "ev-5", employeeName: "Isobel Reyes", type: "check-in", time: "11:15 AM", role: "Sales" },
  { id: "ev-6", employeeName: "RJ Morales", type: "check-out", time: "12:00 PM", role: "Coach" },
];
