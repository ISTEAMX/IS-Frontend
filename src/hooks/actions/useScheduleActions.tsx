import { scheduleEventService } from "@/services/scheduleEventService";
import type {
  DayOfWeek,
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
  const [initialModalData, setInitialModalData] =
    useState<Partial<ScheduleEvent> | null>(null);
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

  const handleApprove = async (id: number) => {
    try {
      setIsActionLoading(true);
      await scheduleEventService.approve(id);
      toast.success("Eveniment aprobat");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error("Eroare la aprobare");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setIsActionLoading(true);
      await scheduleEventService.reject(id);
      toast.success("Eveniment respins");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error("Eroare la respingere");
    } finally {
      setIsActionLoading(false);
    }
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

  const handleOpenAddAtSlot = (day: string, timeSlot: string) => {
    const [startStr, endStr] = timeSlot.split(" - ");
    const startingHour = parseInt(startStr.split(":")[0]);
    const endingHour = parseInt(endStr.split(":")[0]);

    setScheduleToEdit(null);
    setInitialModalData({
      scheduleDay: day as DayOfWeek,
      startingHour: startingHour,
      endingHour: endingHour,
    } as Partial<ScheduleEvent>);

    setIsModalOpen(true);
    setConflict(null);
  };

  const handleDrop = async (
    event: ScheduleEvent,
    newDay: DayOfWeek,
    newTimeSlot: string,
  ) => {
    const [startStr, endStr] = newTimeSlot.split(" - ");
    const newStartingHour = parseInt(startStr.split(":")[0]);
    const newEndingHour = parseInt(endStr.split(":")[0]);

    if (
      event.scheduleDay === newDay &&
      event.startingHour === newStartingHour &&
      event.endingHour === newEndingHour
    ) {
      return;
    }

    setIsActionLoading(true);
    try {
      await scheduleEventService.update({
        id: event.id,
        subjectId: event.subjectDTO.id,
        professorId: event.professorDTO.id,
        groupIds: event.groups.map((g) => g.id),
        roomId: event.roomDTO.id,
        scheduleDay: newDay,
        startingHour: newStartingHour,
        endingHour: newEndingHour,
        frequency: event.frequency,
      });

      toast.success("Evenimentul a fost mutat cu succes.");
      refetch();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        console.error(errorData);
        toast.error(
          typeof errorData === "string"
            ? errorData
            : "Eroare la mutarea evenimentului.",
        );
      } else {
        console.error("A apărut o eroare", err);
        toast.error("Eroare la mutarea evenimentului.");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    state: {
      isModalOpen,
      initialModalData,
      scheduleToEdit,
      scheduleToDelete,
      isActionLoading,
      conflict,
    },
    actions: {
      setIsModalOpen,
      setScheduleToDelete,
      handleOpenAdd,
      handleOpenAddAtSlot,
      handleOpenEdit,
      handleApprove,
      handleReject,
      handleOpenConfirmDelete,
      handleConfirmDelete,
      handleSave,
      handleDrop,
    },
  };
};

export default useScheduleActions;
