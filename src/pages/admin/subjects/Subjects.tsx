import { PageHeader } from "@/components/ui/PageHeader";
import { getColumns } from "./SubjectsColumns";
import styles from "../Page.module.css";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SubjectModal from "@/components/ui/SubjectModal";
import useSubjects from "@/hooks/api/useSubjects";
import useSubjectsActions from "@/hooks/actions/useSubjectsActions";

const Subjects = () => {
  const { subjects, isLoading, refetch } = useSubjects();
  const {
    state: { isModalOpen, subjectToEdit, subjectToDelete, isActionLoading },
    actions: {
      handleOpenEdit,
      handleOpenConfirmDelete,
      handleOpenAdd,
      setIsModalOpen,
      handleSave,
      setSubjectToDelete,
      handleConfirmDelete,
    },
  } = useSubjectsActions(refetch);

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
