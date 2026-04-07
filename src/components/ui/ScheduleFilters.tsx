import useGroups from "@/hooks/useGroups";
import useRooms from "@/hooks/useRooms";
import useTeachers from "@/hooks/useTeachers";
import styles from "./Filters.module.css";
import FilterSelect from "./FilterSelect";

const ScheduleFilters = () => {
  const { rooms } = useRooms();
  const { teachers } = useTeachers();
  const { groups } = useGroups();

  return (
    <div className={styles.container}>
      <div className={styles.filtersBar}>
        <FilterSelect
          label="Grupă"
          options={groups}
          getLabel={(g) => g.identifier}
          getValue={(g) => g.id}
          placeHolder="Toate grupele"
        />

        <FilterSelect
          label="Profesor"
          options={teachers}
          getLabel={(t) => `${t.lastName} ${t.firstName}`}
          getValue={(t) => t.id}
          placeHolder="Toți profesorii"
        />

        <FilterSelect
          label="Sală"
          options={rooms}
          getLabel={(r) => r.name}
          getValue={(r) => r.id}
          placeHolder="Toate sălile"
        />
      </div>
    </div>
  );
};

export default ScheduleFilters;
