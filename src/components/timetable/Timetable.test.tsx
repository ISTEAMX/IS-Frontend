import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Timetable from "./Timetable";
import { useAuthStore } from "@/store/useAuthStore";
import { DAYS } from "@/constants/timetable.constants";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

vi.mock("@/store/useAuthStore");
const mockedUseAuthStore = vi.mocked(useAuthStore);

const mockEvents: ScheduleEvent[] = [
  {
    id: 1,
    subjectDTO: { id: 10, name: "Math", activityType: "Curs" },
    professorDTO: {
      id: 20,
      firstName: "Alice",
      lastName: "Smith",
      department: "Math",
    },
    groupDTO: { id: 30, identifier: "321", specialization: "CS", year: 1 },
    roomDTO: {
      id: 40,
      name: "Amphi A",
      location: "Bld 1",
      type: "Laborator",
      capacity: 100,
    },
    frequency: "SAPTAMANAL",
    scheduleDay: "Luni",
    startingHour: 8,
    endingHour: 10,
  },
];

describe("Timetable Component", () => {
  const mockHandleEdit = vi.fn();
  const mockHandleAdd = vi.fn();

  const mockAuth = (
    isAuthenticated: boolean,
    role: "ADMIN" | "PROFESSOR" | "STUDENT" | null = null,
  ) => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated,
      userData: role ? { role, professorId: 20 } : null,
    } as ReturnType<typeof useAuthStore>);
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Structure & Rendering", () => {
    it("renders all day headers", () => {
      mockAuth(false);
      render(
        <Timetable
          events={[]}
          handleOpenEdit={mockHandleEdit}
          handleOpenAddAtSlot={mockHandleAdd}
        />,
      );

      DAYS.forEach((day) => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it("renders time labels based on event hours", () => {
      mockAuth(false);
      render(
        <Timetable
          events={mockEvents}
          handleOpenEdit={mockHandleEdit}
          handleOpenAddAtSlot={mockHandleAdd}
        />,
      );

      expect(screen.getByText("08:00")).toBeInTheDocument();

      const tenAMLabels = screen.getAllByText("10:00");
      expect(tenAMLabels.length).toBeGreaterThanOrEqual(1);
      expect(tenAMLabels[0]).toBeInTheDocument();
    });
  });

  describe("Functionality & Access Control", () => {
    it("allows ADMIN to trigger the add handler on empty cells", () => {
      mockAuth(true, "ADMIN");
      render(
        <Timetable
          events={mockEvents}
          handleOpenEdit={mockHandleEdit}
          handleOpenAddAtSlot={mockHandleAdd}
        />,
      );

      const emptyCells = screen.getAllByRole("button");
      fireEvent.click(emptyCells[0]);

      expect(mockHandleAdd).toHaveBeenCalled();
    });

    it("prevents STUDENT from seeing add buttons", () => {
      mockAuth(true, "STUDENT");
      const { container } = render(
        <Timetable
          events={mockEvents}
          handleOpenEdit={mockHandleEdit}
          handleOpenAddAtSlot={mockHandleAdd}
        />,
      );

      const addButtons = container.querySelector(".addSuggestion");
      expect(addButtons).not.toBeInTheDocument();
    });

    it("opens edit modal and stops event propagation when clicking an event", () => {
      mockAuth(true, "ADMIN");
      render(
        <Timetable
          events={mockEvents}
          handleOpenEdit={mockHandleEdit}
          handleOpenAddAtSlot={mockHandleAdd}
        />,
      );

      const eventCard = screen.getByText("Math");
      fireEvent.click(eventCard);

      expect(mockHandleEdit).toHaveBeenCalled();
      expect(mockHandleAdd).not.toHaveBeenCalled();
    });
  });
});
