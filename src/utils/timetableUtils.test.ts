import { describe, it, expect } from "vitest";
import { formatHour, generateSortedTimeSlots } from "./timetableUtils";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

describe("formatHour", () => {
  it("should format hour with leading zero", () => {
    expect(formatHour(8)).toBe("08:00");
    expect(formatHour(9)).toBe("09:00");
  });

  it("should handle double-digit hours", () => {
    expect(formatHour(10)).toBe("10:00");
    expect(formatHour(23)).toBe("23:00");
  });

  it("should return 00:00 for undefined hour", () => {
    expect(formatHour(undefined)).toBe("00:00");
  });

  it("should return 00:00 for null hour", () => {
    expect(formatHour(null as unknown as number)).toBe("00:00");
  });

  it("should handle zero hour", () => {
    expect(formatHour(0)).toBe("00:00");
  });
});

describe("generateSortedTimeSlots", () => {
  const mockEvents: ScheduleEvent[] = [
    {
      id: 1,
      subjectDTO: { id: 1, name: "Math", activityType: "Curs" },
      professorDTO: { id: 1, firstName: "John", lastName: "Doe" },
      groups: [{ id: 1, identifier: "A1" }],
      roomDTO: { id: 1, name: "A101", capacity: 30 },
      scheduleDay: "Luni",
      startingHour: 10,
      endingHour: 11,
      frequency: "SAPTAMANAL",
    } as ScheduleEvent,
  ];

  it("should return default slots when events is empty", () => {
    const defaultSlots = ["08:00 - 09:00", "09:00 - 10:00"];
    const result = generateSortedTimeSlots([], defaultSlots);
    expect(result).toEqual(defaultSlots);
  });

  it("should combine events with default slots", () => {
    const defaultSlots = ["08:00 - 09:00"];
    const result = generateSortedTimeSlots(mockEvents, defaultSlots);
    expect(result).toContain("08:00 - 09:00");
    expect(result).toContain("10:00 - 11:00");
  });

  it("should eliminate duplicate slots", () => {
    const defaultSlots = ["10:00 - 11:00", "08:00 - 09:00"];
    const result = generateSortedTimeSlots(mockEvents, defaultSlots);
    const count = result.filter((slot) => slot === "10:00 - 11:00").length;
    expect(count).toBe(1);
  });

  it("should sort slots by start hour", () => {
    const events: ScheduleEvent[] = [
      {
        ...mockEvents[0],
        id: 1,
        startingHour: 14,
        endingHour: 15,
      },
      {
        ...mockEvents[0],
        id: 2,
        startingHour: 8,
        endingHour: 9,
      },
      {
        ...mockEvents[0],
        id: 3,
        startingHour: 10,
        endingHour: 11,
      },
    ];
    const result = generateSortedTimeSlots(events);
    expect(result[0]).toBe("08:00 - 09:00");
    expect(result[1]).toBe("10:00 - 11:00");
    expect(result[2]).toBe("14:00 - 15:00");
  });

  it("should sort by end hour when start hours are equal", () => {
    const events: ScheduleEvent[] = [
      {
        ...mockEvents[0],
        id: 1,
        startingHour: 10,
        endingHour: 12,
      },
      {
        ...mockEvents[0],
        id: 2,
        startingHour: 10,
        endingHour: 11,
      },
    ];
    const result = generateSortedTimeSlots(events);
    expect(result[0]).toBe("10:00 - 11:00");
    expect(result[1]).toBe("10:00 - 12:00");
  });

  it("should handle events with undefined hours", () => {
    const events: ScheduleEvent[] = [
      {
        ...mockEvents[0],
        startingHour: undefined as unknown as number,
        endingHour: undefined as unknown as number,
      },
    ];
    const defaultSlots = ["08:00 - 09:00"];
    const result = generateSortedTimeSlots(events, defaultSlots);
    expect(result).toEqual(defaultSlots);
  });

  it("should return empty array when no events and no defaults", () => {
    const result = generateSortedTimeSlots([]);
    expect(result).toEqual([]);
  });
});
