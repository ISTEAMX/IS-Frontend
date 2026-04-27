import useGroups from "@/hooks/api/useGroups";
import useRooms from "@/hooks/api/useRooms";
import useTeachers from "@/hooks/api/useTeachers";
import styles from "./Filters.module.css";
import FilterSelect from "./FilterSelect";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";
import SearchableSelect from "./SearchableSelect";
import { useMemo } from "react";

interface ScheduleFiltersProps {
  children?: React.ReactNode;
  filters: ScheduleFilterValues;
  onFilterChange: (key: keyof ScheduleFilterValues, value: number | string | null) => void;
}

const SEMESTERS = [1, 2];

const ScheduleFilters = ({
  children,
  filters,
  onFilterChange,
}: ScheduleFiltersProps) => {
  const { rooms } = useRooms();
  const { teachers } = useTeachers();
  const { groups } = useGroups();

  const specializations = useMemo(() => {
    const unique = [...new Set(groups.map((g) => g.specialization))];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [groups]);

  const years = useMemo(() => {
    const unique = [...new Set(groups.map((g) => g.year))];
    return unique.sort((a, b) => a - b);
  }, [groups]);

  const filteredGroups = useMemo(() => {
    let result = groups;
    if (filters.specialization) {
      result = result.filter((g) => g.specialization === filters.specialization);
    }
    if (filters.year) {
      result = result.filter((g) => g.year === filters.year);
    }
    if (filters.semester) {
      result = result.filter((g) => g.semester === filters.semester);
    }
    return result;
  }, [groups, filters.specialization, filters.year, filters.semester]);

  return (
    <div className={styles.container}>
      <div className={styles.filtersBar}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Specializare</label>
          <SearchableSelect
            options={specializations}
            getLabel={(s) => s}
            getValue={(s) => s}
            placeholder="Toate specializările"
            value={filters.specialization || undefined}
            onChange={(val) => {
              onFilterChange("specialization", val as string | null);
              if (filters.groupId) {
                onFilterChange("groupId", null);
              }
            }}
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel}>An</label>
          <SearchableSelect
            options={years}
            getLabel={(y) => `Anul ${y}`}
            getValue={(y) => y}
            placeholder="Toți anii"
            value={filters.year || undefined}
            onChange={(val) => {
              onFilterChange("year", val as number | null);
              if (filters.groupId) {
                onFilterChange("groupId", null);
              }
            }}
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Semestru</label>
          <SearchableSelect
            options={SEMESTERS}
            getLabel={(s) => `Semestrul ${s}`}
            getValue={(s) => s}
            placeholder="Ambele semestre"
            value={filters.semester || undefined}
            onChange={(val) => onFilterChange("semester", val as number | null)}
          />
        </div>

        <FilterSelect
          label="Grupă"
          options={filteredGroups}
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
