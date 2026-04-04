import Timetable from "@/components/timetable/Timetable";
import ScheduleFilters from "@/components/ui/ScheduleFilters";
import { MOCK_EVENTS } from "@/mocks/schedule.events";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <ScheduleFilters />

      <div className={styles.contentWrapper}>
        <Timetable events={MOCK_EVENTS} />
      </div>
    </>
  );
};

export default Home;
