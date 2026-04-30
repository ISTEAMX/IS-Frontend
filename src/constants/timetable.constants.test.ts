import { describe, it, expect } from "vitest";
import {
  DAYS,
  TIME_SLOTS,
  HOURS,
  ACTIVITY_TYPES,
  EVENT_FREQUENCIES,
  EVENT_FREQUENCY_LABELS,
} from "./timetable.constants";

describe("timetable.constants", () => {
  it("should have 5 days (Monday to Friday)", () => {
    expect(DAYS).toHaveLength(5);
    expect(DAYS).toContain("Luni");
    expect(DAYS).toContain("Vineri");
  });

  it("should have time slots defined", () => {
    expect(TIME_SLOTS.length).toBeGreaterThan(0);
    expect(TIME_SLOTS[0]).toBe("08:00 - 10:00");
  });

  it("should have valid hours range", () => {
    expect(HOURS[0]).toBe(8);
    expect(HOURS[HOURS.length - 1]).toBe(21);
  });

  it("should have activity types defined", () => {
    expect(ACTIVITY_TYPES).toContain("Curs");
    expect(ACTIVITY_TYPES).toContain("Laborator");
    expect(ACTIVITY_TYPES).toContain("Proiect");
    expect(ACTIVITY_TYPES).toContain("Seminar");
  });

  it("should have event frequencies defined", () => {
    expect(EVENT_FREQUENCIES).toContain("SAPTAMANAL");
    expect(EVENT_FREQUENCIES).toContain("PARA");
    expect(EVENT_FREQUENCIES).toContain("INPARA");
  });

  it("should have frequency labels for all frequencies", () => {
    EVENT_FREQUENCIES.forEach((freq) => {
      expect(EVENT_FREQUENCY_LABELS[freq]).toBeDefined();
    });
  });
});

