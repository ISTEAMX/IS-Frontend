import Timetable from "@/components/timetable/Timetable";
import { MOCK_EVENTS } from "@/mocks/schedule.events";

const Home = () => {
  return (
    <>
      <Timetable events={MOCK_EVENTS} />
    </>
  );
};

export default Home;
