import Timetable from "@/components/timetable/Timetable";
import ScheduleFilters from "@/components/ui/ScheduleFilters";
import styles from "./Home.module.css";
import ScheduleEventModal from "@/components/ui/ScheduleEventModal";
import useSchedules from "@/hooks/api/useSchedules";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuthStore } from "@/store/useAuthStore";
import AddEventButton from "@/components/ui/AddEventButton";
import useScheduleActions from "@/hooks/actions/useScheduleActions";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

const Home = () => {
  const { schedules, refetch } = useSchedules();
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
      setIsModalOpen,
      setScheduleToDelete,
    },
  } = useScheduleActions(refetch);
  const { isAuthenticated, userData } = useAuthStore();

  return (
    <>
      <ScheduleFilters>
        {isAuthenticated &&
          (userData?.role === "ADMIN" || userData?.role === "PROFESSOR") && (
            <AddEventButton handleClick={handleOpenAdd} />
          )}
      </ScheduleFilters>

      <div className={styles.contentWrapper}>
        <Timetable
          events={schedules}
          handleOpenEdit={handleOpenEdit}
          handleOpenAddAtSlot={handleOpenAddAtSlot}
        />

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
