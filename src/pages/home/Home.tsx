import Timetable from "@/components/timetable/Timetable";
import styles from "./Home.module.css";
import ScheduleEventModal from "@/components/ui/ScheduleEventModal";
import useSchedules from "@/hooks/api/useSchedules";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuthStore } from "@/store/useAuthStore";
import AddEventButton from "@/components/ui/AddEventButton";
import ExportPdfButton from "@/components/ui/ExportPdfButton";
import useScheduleActions from "@/hooks/actions/useScheduleActions";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import ScheduleFilters from "@/components/ui/ScheduleFilters";
import { useCallback, useMemo, useState } from "react";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";
import { exportSchedulePdf } from "@/utils/exportSchedulePdf";

const Home = () => {
  const [filters, setFilters] = useState<ScheduleFilterValues>({
    groupId: null,
    professorId: null,
    roomId: null,
    specialization: null,
    year: null,
    semester: null,
  });

  const { schedules, refetch } = useSchedules(filters);

  const filteredSchedules = useMemo(() => {
    let result = schedules;
    if (filters.specialization) {
      result = result.filter(
        (s) => s.groupDTO.specialization === filters.specialization,
      );
    }
    if (filters.year) {
      result = result.filter((s) => s.groupDTO.year === filters.year);
    }
    if (filters.semester) {
      result = result.filter((s) => s.groupDTO.semester === filters.semester);
    }
    return result;
  }, [schedules, filters.specialization, filters.year]);
  const {
    state: {
      isModalOpen,
      initialModalData,
      scheduleToEdit,
      scheduleToDelete,
      isActionLoading,
      conflict,
    },
    actions: {
      handleOpenAdd,
      handleOpenAddAtSlot,
      handleOpenEdit,
      handleOpenConfirmDelete,
      handleConfirmDelete,
      handleSave,
      handleDrop,
      setIsModalOpen,
      setScheduleToDelete,
    },
  } = useScheduleActions(refetch);

  const { isAuthenticated, userData } = useAuthStore();

  const buildPdfTitle = useCallback(() => {
    const parts: string[] = ["Orar"];
    if (filters.specialization) parts.push(filters.specialization);
    if (filters.year) parts.push(`Anul ${filters.year}`);
    if (filters.semester) parts.push(`Sem. ${filters.semester}`);
    return parts.join(" - ");
  }, [filters.specialization, filters.year, filters.semester]);

  const handleExportPdf = useCallback(() => {
    exportSchedulePdf(filteredSchedules, buildPdfTitle());
  }, [filteredSchedules, buildPdfTitle]);

  return (
    <>
      <ScheduleFilters
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />

      <div className={styles.contentWrapper}>
        <Timetable
          events={filteredSchedules}
          handleOpenEdit={handleOpenEdit}
          handleOpenAddAtSlot={handleOpenAddAtSlot}
          handleDrop={handleDrop}
        />

        <div className={styles.actionsWrapper}>
          <ExportPdfButton handleClick={handleExportPdf} />
          {isAuthenticated &&
            (userData?.role === "ADMIN" || userData?.role === "PROFESSOR") && (
              <AddEventButton handleClick={handleOpenAdd} />
            )}
        </div>

        {isModalOpen && (
          <ScheduleEventModal
            key={scheduleToEdit?.id || "new-event"}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            onDelete={() => {
              setIsModalOpen(false);
              if (scheduleToEdit) handleOpenConfirmDelete(scheduleToEdit);
            }}
            initialData={scheduleToEdit || (initialModalData as ScheduleEvent)}
            conflict={conflict}
          />
        )}

        <ConfirmModal
          open={!!scheduleToDelete}
          title={`Ștergi ${scheduleToDelete?.subjectDTO.name} - ${scheduleToDelete?.subjectDTO.activityType}?`}
          description="Această acțiune nu va putea fi anulată."
          onClose={() => setScheduleToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isActionLoading}
        />
      </div>
    </>
  );
};

export default Home;
