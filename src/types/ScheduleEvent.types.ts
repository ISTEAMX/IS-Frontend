export type ActivityType = "Curs" | "Laborator" | "Seminar";
export type DayOfWeek = "Luni" | "Marți" | "Miercuri" | "Joi" | "Vineri";
export type TimeSlot =
  | "08:00 - 10:00"
  | "10:00 - 12:00"
  | "12:00 - 14:00"
  | "14:00 - 15:00"
  | "15:00 - 17:00"
  | "17:00 - 19:00"
  | "19:00 - 21:00";
export type EventFrequency = "săptămânal" | "pară" | "impară";

export interface ScheduleEvent {
  id: string;
  name: string;
  type: ActivityType;
  teacher: string;
  group: string;
  room: string;
  day: DayOfWeek;
  timeSlot: TimeSlot;
  frequency: EventFrequency;
}
