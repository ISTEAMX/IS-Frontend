import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModalForm.module.css";
import type { Group, GroupDTO } from "@/types/Group.types";

interface GroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: GroupDTO) => void;
  groupToEdit?: Group | null;
}

const emptyGroup: GroupDTO = {
  identifier: "",
  specialization: "",
  year: 1,
};

const GroupModal = ({
  open,
  onClose,
  onSave,
  groupToEdit,
}: GroupModalProps) => {
  const [formData, setFormData] = useState<GroupDTO>(emptyGroup);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(groupToEdit || emptyGroup);
    }
  }, [open, groupToEdit]);

  const handleChange = (field: keyof Group, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isInvalid =
    !formData.identifier.trim() ||
    !formData.specialization.trim() ||
    formData.year < 1;

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
      title={groupToEdit ? "Editează Grupa" : "Adaugă Grupă Nouă"}
      onSubmit={handleSubmit}
      submitLabel={
        isSubmitting ? (
          <div className={styles.btnSpinner}></div>
        ) : groupToEdit ? (
          "Editează"
        ) : (
          "Adaugă"
        )
      }
      disabled={isInvalid || isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formField}>
          <label htmlFor="group-name">Nume</label>
          <input
            id="group-name"
            type="text"
            value={formData.identifier}
            placeholder="ex: 1631"
            onChange={(e) =>
              handleChange("identifier", e.target.value.toUpperCase())
            }
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="group-specialization">Specializarea</label>
          <input
            id="group-specialization"
            type="text"
            value={formData.specialization}
            placeholder="ex: Tehnologia Informației"
            onChange={(e) => handleChange("specialization", e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="group-year">An de Studiu</label>
          <select
            id="group-year"
            className={styles.select}
            value={formData.year}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <option key={y} value={y}>
                Anul {y}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ display: "none" }} />
      </form>
    </BaseModal>
  );
};

export default GroupModal;
