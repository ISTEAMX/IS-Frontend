import type { ACTIVITY_TYPES } from "@/constants/timetable.constants";

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface Subject {
  id: number;
  name: string;
  type: ActivityType;
}

export interface SubjectDTO extends Omit<Subject, "id"> {
  id?: number;
}
