import { describe, expect, it } from "vitest";

import {
  claimLocker,
  filterLockers,
  getLockerSession,
  lockers,
  lockerSessions,
  releaseLockersForRfid,
} from "./lockers";

describe("filterLockers", () => {
  it("filters by locker number query", () => {
    const result = filterLockers(lockers, "202", "all", "all");
    expect(result).toHaveLength(1);
    expect(result[0]?.number).toBe("202");
  });

  it("filters by zone", () => {
    const result = filterLockers(lockers, "", "VIP", "all");
    expect(result.every((locker) => locker.zone === "VIP")).toBe(true);
  });

  it("filters by occupancy", () => {
    const result = filterLockers(lockers, "", "all", "occupied");
    expect(result.every((locker) => locker.occupancy === "occupied")).toBe(true);
  });

  it("supports combined filters", () => {
    const result = filterLockers(lockers, "10", "Women", "all");
    expect(result.every((locker) => locker.zone === "Women")).toBe(true);
    expect(result.every((locker) => locker.number.includes("10"))).toBe(true);
  });
});

describe("locker session helpers", () => {
  it("returns a session by locker id", () => {
    const session = getLockerSession(lockerSessions, "locker-main-002");
    expect(session?.memberName).toBe("Jamie Velasco");
  });

  it("claims a locker and overwrites any existing session", () => {
    const inventory = { lockers, sessions: lockerSessions };
    const claimed = claimLocker(inventory, "locker-main-003", "Mara Bautista", "RFID-123", "Today • 9:01a");

    const updatedLocker = claimed.lockers.find((locker) => locker.id === "locker-main-003");
    expect(updatedLocker?.occupancy).toBe("occupied");

    const session = getLockerSession(claimed.sessions, "locker-main-003");
    expect(session?.rfid).toBe("RFID-123");
  });

  it("releases lockers for an rfid", () => {
    const inventory = { lockers, sessions: lockerSessions };
    const released = releaseLockersForRfid(inventory, "RFID-091882");

    const session = getLockerSession(released.sessions, "locker-main-002");
    expect(session).toBeNull();

    const updatedLocker = released.lockers.find((locker) => locker.id === "locker-main-002");
    expect(updatedLocker?.occupancy).toBe("available");
  });
});
