import type { Subject } from "@/types/Subject.types";

export const MOCK_SUBJECTS: Subject[] = [
  { id: "s1l", name: "Proiectare cu Microprocesoare", type: "Laborator" },
  { id: "s1p", name: "Proiectare cu Microprocesoare", type: "Proiect" },
  { id: "s1c", name: "Proiectare cu Microprocesoare", type: "Curs" },

  { id: "s2l", name: "Cloud Computing", type: "Laborator" },
  { id: "s2c", name: "Cloud Computing", type: "Curs" },

  {
    id: "s3c",
    name: "Integrarea Dispozitivelor Inteligente în Creșterea Sustenabilității Sistemelor",
    type: "Curs",
  },
  {
    id: "s3l",
    name: "Integrarea Dispozitivelor Inteligente în Creșterea Sustenabilității Sistemelor",
    type: "Laborator",
  },

  { id: "s4l", name: "Inginerie Software", type: "Laborator" },
  { id: "s4c", name: "Inginerie Software", type: "Curs" },

  { id: "s5l", name: "Fiabilitate Software", type: "Laborator" },
  { id: "s5c", name: "Fiabilitate Software", type: "Curs" },

  { id: "s6p", name: "Sisteme de Operare Avansate", type: "Proiect" },
  { id: "s6l", name: "Sisteme de Operare Avansate", type: "Laborator" },
  { id: "s6c", name: "Sisteme de Operare Avansate", type: "Curs" },

  { id: "s7c", name: "Tehnologii Multimedia", type: "Curs" },
  { id: "s7l", name: "Tehnologii Multimedia", type: "Laborator" },

  { id: "s8c", name: "Managementul clasei de elevi", type: "Curs" },
  { id: "s8s", name: "Managementul clasei de elevi", type: "Seminar" },
];
