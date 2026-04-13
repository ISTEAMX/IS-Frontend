import useGroups from "@/hooks/api/useGroups";
import useRooms from "@/hooks/api/useRooms";
import useTeachers from "@/hooks/api/useTeachers";
import styles from "./Filters.module.css";
import FilterSelect from "./FilterSelect";

interface ScheduleFiltersProps {
  children?: React.ReactNode;
}

const ScheduleFilters = ({ children }: ScheduleFiltersProps) => {
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

      {children && <div className={styles.actionsWrapper}>{children}</div>}
    </div>
  );
};

export default ScheduleFilters;
