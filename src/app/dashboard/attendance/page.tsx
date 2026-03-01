import type { Metadata, Route } from "next";

import { AttendancePage } from "@/components/attendance/attendance-page";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Attendance | Gymcentrix",
  description: "Daily attendance overview: who's checked in today and recent activity. Biometric check-in coming when backend is ready.",
};

export default function AttendanceRoute() {
  const attendanceRoute = "/dashboard/attendance" as Route;

  return (
    <AppShell activeHref={attendanceRoute}>
      <AttendancePage />
    </AppShell>
  );
}
