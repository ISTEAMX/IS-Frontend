export const DAYS = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"] as const;

export const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
  "19:00 - 21:00",
] as const;

export const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export const ACTIVITY_TYPES = [
  "Curs",
  "Laborator",
  "Proiect",
  "Seminar",
] as const;

export const EVENT_FREQUENCIES = ["SAPTAMANAL", "PARA", "INPARA"] as const;
export const EVENT_FREQUENCY_LABELS: Record<
  (typeof EVENT_FREQUENCIES)[number],
  string
> = {
  SAPTAMANAL: "Săptămânal",
  PARA: "Pară",
  INPARA: "Impară",
};
