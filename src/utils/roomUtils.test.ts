import { describe, it, expect } from "vitest";
import { calculateTotalCapacity, generateLocation } from "./roomUtils";
import type { Room } from "@/types/Room.types";

describe("calculateTotalCapacity", () => {
  it("should sum capacities of all rooms", () => {
    const rooms: Room[] = [
      { id: 1, name: "A101", capacity: 30 } as Room,
      { id: 2, name: "A102", capacity: 25 } as Room,
      { id: 3, name: "B201", capacity: 40 } as Room,
    ];
    expect(calculateTotalCapacity(rooms)).toBe(95);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotalCapacity([])).toBe(0);
  });

  it("should handle single room", () => {
    const rooms: Room[] = [{ id: 1, name: "A101", capacity: 50 } as Room];
    expect(calculateTotalCapacity(rooms)).toBe(50);
  });

  it("should handle rooms with zero capacity", () => {
    const rooms: Room[] = [
      { id: 1, name: "A101", capacity: 0 } as Room,
      { id: 2, name: "A102", capacity: 30 } as Room,
    ];
    expect(calculateTotalCapacity(rooms)).toBe(30);
  });

  it("should handle large numbers", () => {
    const rooms: Room[] = [
      { id: 1, name: "A101", capacity: 100000 } as Room,
      { id: 2, name: "A102", capacity: 100000 } as Room,
    ];
    expect(calculateTotalCapacity(rooms)).toBe(200000);
  });
});

describe("generateLocation", () => {
  it("should generate correct location for valid room code", () => {
    expect(generateLocation("A101")).toBe("Corp A, Etaj 1, Sala 1");
    expect(generateLocation("B205")).toBe("Corp B, Etaj 2, Sala 5");
    expect(generateLocation("C315A")).toBe("Corp C, Etaj 3, Sala 15A");
  });

  it("should return empty string for short names", () => {
    expect(generateLocation("A10")).toBe("");
    expect(generateLocation("A")).toBe("");
    expect(generateLocation("")).toBe("");
  });

  it("should return empty string when corp is not uppercase letter", () => {
    expect(generateLocation("1101")).toBe("");
    expect(generateLocation("a101")).toBe("Corp A, Etaj 1, Sala 1");
  });

  it("should return empty string when floor is not digit", () => {
    expect(generateLocation("AAB01")).toBe("");
    expect(generateLocation("A-101")).toBe("");
  });

  it("should return empty string for invalid room number format", () => {
    expect(generateLocation("A1A01")).toBe("");
    expect(generateLocation("A1-01")).toBe("");
  });

  it("should handle floor 0 as Parter", () => {
    expect(generateLocation("A001")).toContain("Parter");
  });

  it("should handle room numbers with letters", () => {
    expect(generateLocation("A205B")).toBe("Corp A, Etaj 2, Sala 5B");
    expect(generateLocation("D110X")).toBe("Corp D, Etaj 1, Sala 10X");
  });

  it("should handle multi-digit room numbers", () => {
    expect(generateLocation("A2215")).toBe("Corp A, Etaj 2, Sala 215");
  });

  it("should uppercase letter suffix", () => {
    const result = generateLocation("A101a");
    expect(result).toBe("Corp A, Etaj 1, Sala 1A");
  });
});
