import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ActivityCard from "./ActivityCard";
import { useAuthStore } from "@/store/useAuthStore";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

vi.mock("@/store/useAuthStore");
const mockedUseAuthStore = vi.mocked(useAuthStore);

interface MockUserData {
  role: "ADMIN" | "PROFESSOR" | "STUDENT";
  professorId?: number;
}

const baseMockEvent: ScheduleEvent = {
  id: 1,
  subjectDTO: {
    id: 101,
    name: "Web Development",
    activityType: "Laborator",
  },
  professorDTO: {
    id: 201,
    firstName: "John",
    lastName: "Doe",
    department: "Computer Science",
  },
  groupDTO: {
    id: 301,
    identifier: "A1",
    specialization: "Informatics",
    year: 3,
    semester: 1,
  },
  roomDTO: {
    id: 401,
    name: "Room 101",
    location: "Building A",
    type: "Laborator",
    capacity: 30,
  },
  frequency: "PARA",
  scheduleDay: "Luni",
  startingHour: 8,
  endingHour: 10,
};

describe("ActivityCard Component", () => {
  const mockHandleClick = vi.fn();

  const mockAuth = (userData: MockUserData | null) => {
    mockedUseAuthStore.mockReturnValue({
      userData,
      isAuthenticated: !!userData,
    } as ReturnType<typeof useAuthStore>);
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering & Content", () => {
    it("renders all event details correctly", () => {
      mockAuth(null);
      render(
        <ActivityCard event={baseMockEvent} handleClick={mockHandleClick} />,
      );

      expect(screen.getByText("Laborator")).toBeInTheDocument();
      expect(screen.getByText(/^Web Development$/)).toBeInTheDocument();
      expect(screen.getByText("Doe John")).toBeInTheDocument();
      expect(screen.getByText("A1")).toBeInTheDocument();
      expect(screen.getByText("Room 101")).toBeInTheDocument();
    });

    it("displays correct frequency badge text", () => {
      mockAuth(null);
      const { rerender } = render(
        <ActivityCard event={baseMockEvent} handleClick={mockHandleClick} />,
      );
      expect(screen.getByText("Pară")).toBeInTheDocument();

      const imparEvent: ScheduleEvent = {
        ...baseMockEvent,
        frequency: "INPARA",
      };
      rerender(
        <ActivityCard event={imparEvent} handleClick={mockHandleClick} />,
      );
      expect(screen.getByText("Impară")).toBeInTheDocument();
    });

    it("does not show frequency badge for SAPTAMANAL", () => {
      mockAuth(null);
      const weeklyEvent: ScheduleEvent = {
        ...baseMockEvent,
        frequency: "SAPTAMANAL",
      };
      render(
        <ActivityCard event={weeklyEvent} handleClick={mockHandleClick} />,
      );
      expect(screen.queryByText("Pară")).not.toBeInTheDocument();
      expect(screen.queryByText("Impară")).not.toBeInTheDocument();
    });
  });

  describe("Edit Permissions (RBAC Logic)", () => {
    it("allows ADMIN to edit any card", () => {
      mockAuth({ role: "ADMIN" });
      render(
        <ActivityCard event={baseMockEvent} handleClick={mockHandleClick} />,
      );

      fireEvent.click(screen.getByText(/^Web Development$/));
      expect(mockHandleClick).toHaveBeenCalled();
    });

    it("allows PROFESSOR to edit their own card", () => {
      mockAuth({ role: "PROFESSOR", professorId: 201 });
      render(
        <ActivityCard event={baseMockEvent} handleClick={mockHandleClick} />,
      );

      fireEvent.click(screen.getByText(/^Web Development$/));
      expect(mockHandleClick).toHaveBeenCalled();
    });

    it("prevents PROFESSOR from editing others' cards", () => {
      mockAuth({ role: "PROFESSOR", professorId: 999 });
      render(
        <ActivityCard event={baseMockEvent} handleClick={mockHandleClick} />,
      );

      fireEvent.click(screen.getByText(/^Web Development$/));
      expect(mockHandleClick).not.toHaveBeenCalled();
    });

    it("prevents STUDENT from editing", () => {
      mockAuth({ role: "STUDENT" });
      render(
        <ActivityCard event={baseMockEvent} handleClick={mockHandleClick} />,
      );

      fireEvent.click(screen.getByText(/^Web Development$/));
      expect(mockHandleClick).not.toHaveBeenCalled();
    });
  });
});
