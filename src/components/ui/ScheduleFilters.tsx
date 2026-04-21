import useGroups from "@/hooks/api/useGroups";
import useRooms from "@/hooks/api/useRooms";
import useTeachers from "@/hooks/api/useTeachers";
import styles from "./Filters.module.css";
import FilterSelect from "./FilterSelect";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";

interface ScheduleFiltersProps {
  children?: React.ReactNode;
  filters: ScheduleFilterValues;
  onFilterChange: (key: keyof ScheduleFilterValues, value: number | null) => void;
}

const ScheduleFilters = ({
  children,
  filters,
  onFilterChange,
}: ScheduleFiltersProps) => {
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
          value={filters.groupId?.toString()}
          onChange={(val) => onFilterChange("groupId", val)}
        />

        <FilterSelect
          label="Profesor"
          options={teachers}
          getLabel={(t) => `${t.lastName} ${t.firstName}`}
          getValue={(t) => t.id}
          placeHolder="Toți profesorii"
          value={filters.professorId?.toString()}
          onChange={(val) => onFilterChange("professorId", val)}
        />

        <FilterSelect
          label="Sală"
          options={rooms}
          getLabel={(r) => r.name}
          getValue={(r) => r.id}
          placeHolder="Toate sălile"
          value={filters.roomId?.toString()}
          onChange={(val) => onFilterChange("roomId", val)}
        />
      </div>

      {children && <div className={styles.actionsWrapper}>{children}</div>}
    </div>
  );
};

export default ScheduleFilters;
