export type AttendanceStatus = "on-track" | "warning" | "missed";
export type EmployeeRole = "Coach" | "Front Desk" | "Maintenance" | "Operations" | "Sales";

export type AttendanceEvent = {
  id: string;
  date: string;
  status: AttendanceStatus;
  note: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  shiftWindow: string;
  biometricId: string;
  lastCheckIn: string;
  attendanceStreak: number;
  compliance: AttendanceStatus;
  avatarInitials?: string;
  notes: string;
  attendance: AttendanceEvent[];
};

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Mara Bautista",
    email: "mara@elevatefit.studio",
    role: "Coach",
    shiftWindow: "5:30a – 1:00p",
    biometricId: "BIO-4418",
    lastCheckIn: "Today • 5:11a",
    attendanceStreak: 42,
    compliance: "on-track",
    notes: "AM performance team lead",
    attendance: [
      { id: "e-1", date: "Jan 24", status: "on-track", note: "Opened studio" },
      { id: "e-2", date: "Jan 23", status: "on-track", note: "Led strength block" },
      { id: "e-3", date: "Jan 22", status: "on-track", note: "Covered mobility" },
    ],
  },
  {
    id: "emp-002",
    name: "Lance Navarro",
    email: "lance@elevatefit.studio",
    role: "Front Desk",
    shiftWindow: "6:30a – 3:00p",
    biometricId: "BIO-5522",
    lastCheckIn: "Today • 6:32a",
    attendanceStreak: 18,
    compliance: "warning",
    notes: "arrives close to shift start on Mondays",
    attendance: [
      { id: "e-4", date: "Jan 24", status: "warning", note: "Clocked in 2 min late" },
      { id: "e-5", date: "Jan 23", status: "on-track", note: "Full shift" },
      { id: "e-6", date: "Jan 22", status: "on-track", note: "Full shift" },
    ],
  },
  {
    id: "emp-003",
    name: "Serena Uy",
    email: "serena@elevatefit.studio",
    role: "Operations",
    shiftWindow: "10:00a – 7:00p",
    biometricId: "BIO-3381",
    lastCheckIn: "Yesterday • 9:54a",
    attendanceStreak: 30,
    compliance: "on-track",
    notes: "Ops manager overseeing schedules",
    attendance: [
      { id: "e-7", date: "Jan 24", status: "on-track", note: "Weekend coverage" },
      { id: "e-8", date: "Jan 23", status: "on-track", note: "Shift swap approval" },
      { id: "e-9", date: "Jan 22", status: "on-track", note: "Inventory count" },
    ],
  },
  {
    id: "emp-004",
    name: "Theo Alvarez",
    email: "theo@elevatefit.studio",
    role: "Maintenance",
    shiftWindow: "2:00p – 10:00p",
    biometricId: "BIO-7726",
    lastCheckIn: "Today • 2:07p",
    attendanceStreak: 8,
    compliance: "missed",
    notes: "missed Jan 21 deep clean",
    attendance: [
      { id: "e-10", date: "Jan 24", status: "on-track", note: "Locker reset" },
      { id: "e-11", date: "Jan 23", status: "on-track", note: "HVAC check" },
      { id: "e-12", date: "Jan 22", status: "missed", note: "No show – reported" },
    ],
  },
  {
    id: "emp-005",
    name: "Isobel Tan",
    email: "isobel@elevatefit.studio",
    role: "Sales",
    shiftWindow: "11:00a – 8:00p",
    biometricId: "BIO-9934",
    lastCheckIn: "Today • 10:51a",
    attendanceStreak: 60,
    compliance: "on-track",
    notes: "Top conversions for PT add-ons",
    attendance: [
      { id: "e-13", date: "Jan 24", status: "on-track", note: "Closed 3 renewals" },
      { id: "e-14", date: "Jan 23", status: "on-track", note: "Presented PT" },
      { id: "e-15", date: "Jan 22", status: "on-track", note: "Follow-up blitz" },
    ],
  },
  {
    id: "emp-006",
    name: "RJ Mercado",
    email: "rj@elevatefit.studio",
    role: "Coach",
    shiftWindow: "1:00p – 9:00p",
    biometricId: "BIO-6644",
    lastCheckIn: "Today • 12:51p",
    attendanceStreak: 5,
    compliance: "warning",
    notes: "filling in for PT reassignments",
    attendance: [
      { id: "e-16", date: "Jan 24", status: "warning", note: "Left 20 min early" },
      { id: "e-17", date: "Jan 23", status: "on-track", note: "Coached conditioning" },
      { id: "e-18", date: "Jan 22", status: "on-track", note: "Buddy session" },
    ],
  },
];

export function filterEmployees(
  list: Employee[],
  query: string,
  status: AttendanceStatus | "all",
  role: EmployeeRole | "all"
) {
  const normalizedQuery = query.trim().toLowerCase();

  return list.filter((employee) => {
    const matchesQuery = normalizedQuery
      ? employee.name.toLowerCase().includes(normalizedQuery) || employee.email.toLowerCase().includes(normalizedQuery)
      : true;

    const matchesStatus = status === "all" ? true : employee.compliance === status;
    const matchesRole = role === "all" ? true : employee.role === role;

    return matchesQuery && matchesStatus && matchesRole;
  });
}
