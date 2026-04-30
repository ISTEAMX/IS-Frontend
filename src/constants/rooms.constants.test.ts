import { describe, it, expect } from "vitest";
import { ROOM_TYPES } from "./rooms.constants";

describe("rooms.constants", () => {
  it("should have room types defined", () => {
    expect(ROOM_TYPES).toHaveLength(3);
    expect(ROOM_TYPES).toContain("Amfiteatru");
    expect(ROOM_TYPES).toContain("Laborator");
    expect(ROOM_TYPES).toContain("Seminar");
  });
});

