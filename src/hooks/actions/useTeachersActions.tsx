import { teacherService } from "@/services/teacherService";
import type { Teacher, TeacherDTO } from "@/types/Teacher.types";
import { useState } from "react";
import toast from "react-hot-toast";

const useTeachersActions = (refetch: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleOpenEdit = (teacher: Teacher) => {
    setTeacherToEdit(teacher);
    setIsModalOpen(true);
  };

  const handleOpenConfirmDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };

  const handleConfirmDelete = async () => {
    if (teacherToDelete) {
      // DELETE
      setIsActionLoading(true);
      try {
        await teacherService.delete(teacherToDelete.id);

        toast.success(
          `Profesorul ${teacherToDelete.firstName + " " + teacherToDelete.lastName} a fost șters cu succes.`,
        );
        refetch();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea profesorului.");
      } finally {
        setIsActionLoading(false);
        setTeacherToDelete(null);
      }
    }
  };

  const handleSave = async (formData: TeacherDTO) => {
    setIsActionLoading(true);
    try {
      if (teacherToEdit) {
        // EDIT
        await teacherService.update({ ...formData, id: teacherToEdit.id });

        toast.success("Profesorul a fost modificat cu succes.");
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Eroare la salvarea profesorului.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    state: { isModalOpen, teacherToEdit, teacherToDelete, isActionLoading },
    actions: {
      setIsModalOpen,
      handleSave,
      handleOpenEdit,
      setTeacherToDelete,
      handleOpenConfirmDelete,
      handleConfirmDelete,
    },
  };
};

export default useTeachersActions;
