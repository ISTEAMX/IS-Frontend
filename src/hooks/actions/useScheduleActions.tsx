import { scheduleEventService } from "@/services/scheduleEventService";
import type {
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const useScheduleActions = (refetch: () => void) => {
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
    setConflict(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: ScheduleEvent) => {
    setScheduleToEdit(event);
    setConflict(null);
    setIsModalOpen(true);
  };

  const handleOpenConfirmDelete = (event: ScheduleEvent) => {
    setScheduleToDelete(event);
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

  return {
    state: {
      isModalOpen,
      scheduleToEdit,
      scheduleToDelete,
      isActionLoading,
      conflict,
    },
    actions: {
      setIsModalOpen,
      setScheduleToDelete,
      handleOpenAdd,
      handleOpenEdit,
      handleOpenConfirmDelete,
      handleConfirmDelete,
      handleSave,
    },
  };
};

export default useScheduleActions;
