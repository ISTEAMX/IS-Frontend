import { subjectService } from "@/services/subjectService";
import type { Subject, SubjectDTO } from "@/types/Subject.types";
import { useState } from "react";
import toast from "react-hot-toast";

const useSubjectsActions = (refetch: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleOpenAdd = () => {
    setSubjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsModalOpen(true);
  };

  const handleOpenConfirmDelete = (subject: Subject) => {
    setSubjectToDelete(subject);
  };

  const handleConfirmDelete = async () => {
    if (subjectToDelete) {
      // DELETE
      setIsActionLoading(true);
      try {
        await subjectService.delete(subjectToDelete.id);

        toast.success(
          `Disciplina ${subjectToDelete.name} a fost ștearsă cu succes.`,
        );
        refetch();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea disciplinei.");
      } finally {
        setIsActionLoading(false);
        setSubjectToDelete(null);
      }
    }
  };

  const handleSave = async (formData: SubjectDTO) => {
    setIsActionLoading(true);
    try {
      if (subjectToEdit) {
        // EDIT
        await subjectService.update({ ...formData, id: subjectToEdit.id });

        toast.success("Disciplina a fost modificată cu succes.");
        refetch();
      } else {
        // ADD
        await subjectService.create(formData);

        toast.success("Disciplina a fost adăugată cu succes.");
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Eroare la salvarea disciplinei.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    state: { isModalOpen, subjectToEdit, subjectToDelete, isActionLoading },
    actions: {
      setIsModalOpen,
      handleSave,
      handleOpenAdd,
      handleOpenEdit,
      setSubjectToDelete,
      handleOpenConfirmDelete,
      handleConfirmDelete,
    },
  };
};

export default useSubjectsActions;
