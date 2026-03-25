export type LockerZone = "Main" | "VIP" | "Women";
export type LockerOccupancy = "available" | "occupied";

export type Locker = {
  id: string;
  number: string;
  zone: LockerZone;
  occupancy: LockerOccupancy;
};

export type LockerSession = {
  lockerId: string;
  memberName: string;
  rfid: string;
  claimedAt: string;
};

export type LockerInventory = {
  lockers: Locker[];
  sessions: LockerSession[];
};

export const lockers: Locker[] = [
  { id: "locker-main-001", number: "001", zone: "Main", occupancy: "available" },
  { id: "locker-main-002", number: "002", zone: "Main", occupancy: "occupied" },
  { id: "locker-main-003", number: "003", zone: "Main", occupancy: "available" },
  { id: "locker-main-004", number: "004", zone: "Main", occupancy: "available" },
  { id: "locker-main-005", number: "005", zone: "Main", occupancy: "occupied" },
  { id: "locker-women-101", number: "101", zone: "Women", occupancy: "available" },
  { id: "locker-women-102", number: "102", zone: "Women", occupancy: "occupied" },
  { id: "locker-women-103", number: "103", zone: "Women", occupancy: "available" },
  { id: "locker-vip-201", number: "201", zone: "VIP", occupancy: "available" },
  { id: "locker-vip-202", number: "202", zone: "VIP", occupancy: "occupied" },
  { id: "locker-vip-203", number: "203", zone: "VIP", occupancy: "available" },
];

export const lockerSessions: LockerSession[] = [
  {
    lockerId: "locker-main-002",
    memberName: "Jamie Velasco",
    rfid: "RFID-091882",
    claimedAt: "Today • 6:12a",
  },
  {
    lockerId: "locker-main-005",
    memberName: "Hana Cruz",
    rfid: "RFID-440912",
    claimedAt: "Today • 7:41a",
  },
  {
    lockerId: "locker-women-102",
    memberName: "Sienna Flores",
    rfid: "RFID-119003",
    claimedAt: "Today • 8:05a",
  },
  {
    lockerId: "locker-vip-202",
    memberName: "Theo Alvarez",
    rfid: "RFID-772600",
    claimedAt: "Today • 8:47a",
  },
];

export function filterLockers(
  list: Locker[],
  query: string,
  zone: LockerZone | "all",
  occupancy: LockerOccupancy | "all"
) {
  const normalizedQuery = query.trim().toLowerCase();

  return list.filter((locker) => {
    const matchesQuery = normalizedQuery
      ? locker.number.toLowerCase().includes(normalizedQuery) || locker.zone.toLowerCase().includes(normalizedQuery)
      : true;

    const matchesZone = zone === "all" ? true : locker.zone === zone;
    const matchesOccupancy = occupancy === "all" ? true : locker.occupancy === occupancy;

    return matchesQuery && matchesZone && matchesOccupancy;
  });
}

export function claimLocker(inventory: LockerInventory, lockerId: string, memberName: string, rfid: string, claimedAt: string) {
  const lockersNext = inventory.lockers.map((locker) =>
    locker.id === lockerId ? { ...locker, occupancy: "occupied" as const } : locker
  );

  const sessionsNext = [
    ...inventory.sessions.filter((session) => session.lockerId !== lockerId),
    { lockerId, memberName, rfid, claimedAt },
  ];

  return { lockers: lockersNext, sessions: sessionsNext };
}

export function releaseLockersForRfid(inventory: LockerInventory, rfid: string) {
  const releasedLockerIds = new Set(
    inventory.sessions.filter((session) => session.rfid === rfid).map((session) => session.lockerId)
  );

  const lockersNext = inventory.lockers.map((locker) =>
    releasedLockerIds.has(locker.id) ? { ...locker, occupancy: "available" as const } : locker
  );

  const sessionsNext = inventory.sessions.filter((session) => session.rfid !== rfid);

  return { lockers: lockersNext, sessions: sessionsNext };
}

export function getLockerSession(sessions: LockerSession[], lockerId: string) {
  return sessions.find((session) => session.lockerId === lockerId) ?? null;
}
