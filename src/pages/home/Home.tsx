import Timetable from "@/components/timetable/Timetable";
import ScheduleFilters from "@/components/ui/ScheduleFilters";
import styles from "./Home.module.css";
import { useState } from "react";
import type {
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import toast from "react-hot-toast";
import { scheduleEventService } from "@/services/scheduleEventService";
import ScheduleEventModal from "@/components/ui/ScheduleEventModal";
import useSchedules from "@/hooks/useSchedules";
import axios from "axios";
import ConfirmModal from "@/components/ui/ConfirmModal";

const Home = () => {
  const { schedules, refetch } = useSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<ScheduleEvent | null>(
    null,
  );
  const [scheduleToDelete, setScheduleToDelete] =
    useState<ScheduleEvent | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setScheduleToEdit(null);
    setIsModalOpen(true);
    setConflict(null);
  };

  const handleOpenEdit = (scheduleEvent: ScheduleEvent) => {
    setScheduleToEdit(scheduleEvent);
    setIsModalOpen(true);
    setConflict(null);
  };

  const handleOpenConfirmDelete = (scheduleEvent: ScheduleEvent) => {
    setScheduleToDelete(scheduleEvent);
  };

  const handleConfirmDelete = async () => {
    if (scheduleToDelete) {
      // DELETE
      setIsActionLoading(true);
      try {
        await scheduleEventService.delete(scheduleToDelete.id);

        toast.success(`Evenimentul a fost șters cu succes.`);
        refetch();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea evenimentului.");
      } finally {
        setIsActionLoading(false);
        setScheduleToDelete(null);
      }
    }
  };

  const handleSave = async (formData: ScheduleEventDTO) => {
    setIsActionLoading(true);
    try {
      setConflict(null);
      if (scheduleToEdit) {
        // EDIT
        await scheduleEventService.update({
          ...formData,
          id: scheduleToEdit.id,
        });

        toast.success("Evenimentul a fost modificat cu succes.");
        refetch();
      } else {
        // ADD
        await scheduleEventService.create(formData);

        toast.success("Evenimentul a fost adăugat cu succes.");
        refetch();
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;

        console.error(errorData);
        setConflict(errorData);
      } else {
        console.error("A apărut o eroare", err);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <ScheduleFilters />

      <div className={styles.contentWrapper}>
        <button
          onClick={handleOpenAdd}
          style={{ background: "red", width: "50px", height: "50px" }}
        >
          Add event
        </button>

        <Timetable events={schedules} handleOpenEdit={handleOpenEdit} />

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
            initialData={scheduleToEdit}
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
