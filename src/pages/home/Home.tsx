import Timetable from "@/components/timetable/Timetable";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

// Placeholder events
const MOCK_EVENTS: ScheduleEvent[] = [
  {
    id: "1",
    name: "Analiză Matematică",
    type: "Curs",
    teacher: "Popescu",
    group: "1631A",
    room: "A1",
    day: "Luni",
    timeSlot: "08:00 - 10:00",
    frequency: "săptămânal",
  },
  {
    id: "2",
    name: "Programare C++",
    type: "Laborator",
    teacher: "Ionescu",
    group: "1631A",
    room: "L102",
    day: "Marți",
    timeSlot: "12:00 - 14:00",
    frequency: "pară",
  },
  {
    id: "2",
    name: "Programare C++",
    type: "Seminar",
    teacher: "Ionescu",
    group: "1631A",
    room: "L102",
    day: "Joi",
    timeSlot: "15:00 - 17:00",
    frequency: "impară",
  },
];

const Home = () => {
  return (
    <>
      <Timetable events={MOCK_EVENTS} />
    </>
  );
};

export default Home;
