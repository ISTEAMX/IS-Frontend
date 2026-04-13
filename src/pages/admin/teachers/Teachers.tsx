import { PageHeader } from "@/components/ui/PageHeader";
import useTeachers from "@/hooks/api/useTeachers";
import { useNavigate } from "react-router-dom";
import styles from "../Page.module.css";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getColumns } from "./TeacherColumns";
import TeacherModal from "@/components/ui/TeacherModal";
import useTeachersActions from "@/hooks/actions/useTeachersActions";

const Teachers = () => {
  const { teachers, isLoading, refetch } = useTeachers();
  const {
    state: { isModalOpen, teacherToEdit, teacherToDelete, isActionLoading },
    actions: {
      handleOpenEdit,
      handleOpenConfirmDelete,
      setIsModalOpen,
      handleSave,
      setTeacherToDelete,
      handleConfirmDelete,
    },
  } = useTeachersActions(refetch);
  const navigate = useNavigate();

  const tableColumns = getColumns(handleOpenEdit, handleOpenConfirmDelete);

  return (
    <>
      <PageHeader
        title="Profesori"
        onAddClick={() => navigate("/admin/register")}
      />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard
            title="Total Profesori"
            info={isLoading ? "..." : teachers.length}
          />
        </div>

        <DataTable
          columns={tableColumns}
          data={teachers}
          title="Listă Profesori"
          searchPlaceholder="Caută profesor..."
          isLoading={isLoading}
        />

        <TeacherModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          teacherToEdit={teacherToEdit}
        />

        <ConfirmModal
          open={!!teacherToDelete}
          title={`Ștergi profesorul ${teacherToDelete?.lastName + " " + teacherToDelete?.firstName}?`}
          description="Această acțiune nu va putea fi anulată."
          onClose={() => setTeacherToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isActionLoading}
        />
      </div>
    </>
  );
};

export default Teachers;
