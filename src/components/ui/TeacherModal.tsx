import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModalForm.module.css";
import type { Teacher, TeacherDTO } from "@/types/Teacher.types";

interface TeacherModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TeacherDTO) => void;
  teacherToEdit?: Teacher | null;
}

const emptyTeacher: TeacherDTO = {
  firstName: "",
  lastName: "",
  department: "Calculatoare și Tehnologia Informației",
};

const TeacherModal = ({
  open,
  onClose,
  onSave,
  teacherToEdit,
}: TeacherModalProps) => {
  const [formData, setFormData] = useState<TeacherDTO>(emptyTeacher);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(teacherToEdit || emptyTeacher);
    }
  }, [open, teacherToEdit]);

  const handleChange = (field: keyof Teacher, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isInvalid =
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.department.trim();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isInvalid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={teacherToEdit ? "Editează Profesorul" : "Adaugă Profesor Nou"}
      onSubmit={handleSubmit}
      submitLabel={
        isSubmitting ? (
          <div className={styles.btnSpinner}></div>
        ) : teacherToEdit ? (
          "Editează"
        ) : (
          "Adaugă"
        )
      }
      disabled={isInvalid || isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formField}>
          <label htmlFor="teacher-lastName">Nume</label>
          <input
            id="teacher-lastName"
            type="text"
            value={formData.lastName}
            placeholder="Numele"
            onChange={(e) => handleChange("lastName", e.target.value)}
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="teacher-firstName">Prenume</label>
          <input
            id="teacher-firstName"
            type="text"
            value={formData.firstName}
            placeholder="Prenumele"
            onChange={(e) => handleChange("firstName", e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="teacher-department">Departament</label>
          <input
            id="teacher-department"
            type="text"
            value={formData.department}
            placeholder="ex: Calculatoare și Tehnologia Informației"
            onChange={(e) => handleChange("department", e.target.value)}
            autoComplete="off"
          />
        </div>

        <button type="submit" style={{ display: "none" }} />
      </form>
    </BaseModal>
  );
};

export default TeacherModal;
