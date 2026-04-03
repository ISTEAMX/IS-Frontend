import { PageHeader } from "@/components/ui/PageHeader";
import useTeachers from "@/hooks/useTeachers";
import { teacherService } from "@/services/teacherService";
import type { Teacher, TeacherDTO } from "@/types/Teacher.types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "../Page.module.css";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getColumns } from "./TeacherColumns";
import TeacherModal from "@/components/ui/TeacherModal";

const Teachers = () => {
  const { teachers, isLoading, refetch } = useTeachers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const navigate = useNavigate();

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
