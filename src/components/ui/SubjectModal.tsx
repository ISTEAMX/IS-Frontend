import type { ActivityType, Subject, SubjectDTO } from "@/types/Subject.types";
import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModalForm.module.css";
import { ACTIVITY_TYPES } from "@/constants/timetable.constants";

interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SubjectDTO) => void;
  subjectToEdit?: Subject | null;
}

const emptySubject: SubjectDTO = {
  name: "",
  activityType: "Curs",
};

const SubjectModal = ({
  open,
  onClose,
  onSave,
  subjectToEdit,
}: SubjectModalProps) => {
  const [formData, setFormData] = useState<SubjectDTO>(emptySubject);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(subjectToEdit || emptySubject);
    }
  }, [open, subjectToEdit]);

  const handleChange = (field: keyof Subject, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isInvalid = !formData.name.trim() || !formData.activityType.trim();

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
      title={subjectToEdit ? "Editează Disciplina" : "Adaugă Disciplină Nouă"}
      onSubmit={handleSubmit}
      submitLabel={
        isSubmitting ? (
          <div className={styles.btnSpinner}></div>
        ) : subjectToEdit ? (
          "Editează"
        ) : (
          "Adaugă"
        )
      }
      disabled={isInvalid || isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formField}>
          <label htmlFor="subject-name">Nume</label>
          <input
            id="subject-name"
            type="text"
            value={formData.name}
            placeholder="ex: Inginerie Software"
            onChange={(e) => handleChange("name", e.target.value)}
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="subject-type">Tip</label>
          <select
            id="subject-type"
            value={formData.activityType}
            onChange={(e) =>
              handleChange("activityType", e.target.value as ActivityType)
            }
          >
            {ACTIVITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ display: "none" }} />
      </form>
    </BaseModal>
  );
};

export default SubjectModal;
