import { PageHeader } from "@/components/ui/PageHeader";
import type { Subject, SubjectDTO } from "@/types/Subject.types";
import { useState } from "react";
import toast from "react-hot-toast";
import { getColumns } from "./SubjectsColumns";
import styles from "../Page.module.css";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SubjectModal from "@/components/ui/SubjectModal";
import useSubjects from "@/hooks/useSubjects";
import { subjectService } from "@/services/subjectService";

const Subjects = () => {
  const { subjects, isLoading, refetch } = useSubjects();

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

  const tableColumns = getColumns(handleOpenEdit, handleOpenConfirmDelete);

  return (
    <>
      <PageHeader title="Discipline" onAddClick={handleOpenAdd} />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard
            title="Total Discipline"
            info={isLoading ? "..." : subjects.length}
          />
        </div>

        <DataTable
          columns={tableColumns}
          data={subjects}
          title="Listă Discipline"
          searchPlaceholder="Caută disciplină..."
          isLoading={isLoading}
        />

        <SubjectModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          subjectToEdit={subjectToEdit}
        />

        <ConfirmModal
          open={!!subjectToDelete}
          title={`Ștergi disciplina ${subjectToDelete?.name} - ${subjectToDelete?.activityType}?`}
          description="Această acțiune nu va putea fi anulată."
          onClose={() => setSubjectToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isActionLoading}
        />
      </div>
    </>
  );
};

export default Subjects;
