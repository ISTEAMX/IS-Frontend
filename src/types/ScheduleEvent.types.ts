import type {
  ACTIVITY_TYPES,
  DAYS,
  EVENT_FREQUENCIES,
} from "@/constants/timetable.constants";
import type { Subject } from "./Subject.types";
import type { Teacher } from "./Teacher.types";
import type { Group } from "./Group.types";
import type { Room } from "./Room.types";

export type DayOfWeek = (typeof DAYS)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type EventFrequency = (typeof EVENT_FREQUENCIES)[number];

export interface ScheduleEvent {
  id: number;
  subjectDTO: Subject;
  professorDTO: Teacher;
  groups: Group[];
  roomDTO: Room;
  scheduleDay: DayOfWeek;
  startingHour: number;
  endingHour: number;
  frequency: EventFrequency;
}

export interface ScheduleEventDTO {
  id?: number;
  subjectId: number;
  professorId: number;
  groupIds: number[];
  roomId: number;
  scheduleDay: DayOfWeek;
  startingHour: number;
  endingHour: number;
  frequency: EventFrequency;
}
