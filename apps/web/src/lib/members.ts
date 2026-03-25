export type MemberStatus = "active" | "frozen" | "pending";
export type MemberTier = "Standard" | "Premium" | "Elite" | "Student";

export type Member = {
  id: string;
  name: string;
  email: string;
  tier: MemberTier;
  status: MemberStatus;
  lastCheckIn: string;
  attendanceStreak: number;
  rfid: string;
  phone: string;
  favoriteCoach: string;
  goals: string;
};

export const members: Member[] = [
  {
    id: "mem-101",
    name: "Jordan Rivera",
    email: "jordan.rivera@elevate.fit",
    tier: "Elite",
    status: "active",
    lastCheckIn: "Today · 7:12 AM",
    attendanceStreak: 18,
    rfid: "RFID-9345",
    phone: "+1 (415) 555-0199",
    favoriteCoach: "Andre Lin",
    goals: "Prep for spring competition, focus on explosiveness",
  },
  {
    id: "mem-102",
    name: "Maya Lopez",
    email: "maya.lopez@elevate.fit",
    tier: "Premium",
    status: "active",
    lastCheckIn: "Yesterday · 6:44 PM",
    attendanceStreak: 6,
    rfid: "RFID-7821",
    phone: "+1 (917) 555-0144",
    favoriteCoach: "H. Santos",
    goals: "Stability + mobility post-marathon",
  },
  {
    id: "mem-103",
    name: "Andre Lin",
    email: "andre.lin@elevate.fit",
    tier: "Elite",
    status: "active",
    lastCheckIn: "Today · 5:55 AM",
    attendanceStreak: 24,
    rfid: "RFID-4155",
    phone: "+1 (310) 555-2201",
    favoriteCoach: "Staff (self)",
    goals: "Coach program QA",
  },
  {
    id: "mem-104",
    name: "Noelle Park",
    email: "noelle.park@elevate.fit",
    tier: "Premium",
    status: "frozen",
    lastCheckIn: "12 days ago",
    attendanceStreak: 0,
    rfid: "RFID-8333",
    phone: "+1 (206) 555-7812",
    favoriteCoach: "Kat Patel",
    goals: "Recover from travel, restart PT",
  },
  {
    id: "mem-105",
    name: "Harvey Santos",
    email: "harvey.santos@elevate.fit",
    tier: "Standard",
    status: "pending",
    lastCheckIn: "—",
    attendanceStreak: 0,
    rfid: "TBD",
    phone: "+1 (347) 555-7788",
    favoriteCoach: "Assign",
    goals: "Locker set-up, awaiting photo",
  },
  {
    id: "mem-106",
    name: "Lena Adebayo",
    email: "lena.adebayo@elevate.fit",
    tier: "Elite",
    status: "active",
    lastCheckIn: "Today · 8:05 AM",
    attendanceStreak: 42,
    rfid: "RFID-2299",
    phone: "+1 (503) 555-4401",
    favoriteCoach: "Andre Lin",
    goals: "Olympic lifting cycle",
  },
  {
    id: "mem-107",
    name: "Casey Watanabe",
    email: "casey.watanabe@elevate.fit",
    tier: "Student",
    status: "active",
    lastCheckIn: "Yesterday · 4:15 PM",
    attendanceStreak: 9,
    rfid: "RFID-5520",
    phone: "+1 (213) 555-0098",
    favoriteCoach: "No assignment",
    goals: "Weekend climb prep",
  },
  {
    id: "mem-108",
    name: "Sasha Morgan",
    email: "sasha.morgan@elevate.fit",
    tier: "Premium",
    status: "pending",
    lastCheckIn: "—",
    attendanceStreak: 0,
    rfid: "TBD",
    phone: "+1 (702) 555-3124",
    favoriteCoach: "Assign",
    goals: "RFID kit waiting pickup",
  },
];

export function filterMembers(
  list: Member[],
  query: string,
  status: MemberStatus | "all",
  tier: MemberTier | "all"
) {
  const normalizedQuery = query.trim().toLowerCase();

  return list.filter((member) => {
    const matchesQuery = normalizedQuery
      ? member.name.toLowerCase().includes(normalizedQuery) || member.email.toLowerCase().includes(normalizedQuery)
      : true;

    const matchesStatus = status === "all" ? true : member.status === status;
    const matchesTier = tier === "all" ? true : member.tier === tier;

    return matchesQuery && matchesStatus && matchesTier;
  });
}
