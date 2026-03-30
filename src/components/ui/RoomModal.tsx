import type { Room, RoomType } from "@/types/Room.types";
import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { ROOM_TYPES } from "@/constants/rooms.constants";
import styles from "./ModalForm.module.css";
import { generateLocation } from "@/utils/roomUtils";

interface RoomModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Room) => void;
  roomToEdit?: Room | null;
}

const emptyRoom: Room = {
  id: "",
  name: "",
  location: "",
  type: "Amfiteatru",
  capacity: 0,
};

const RoomModal = ({ open, onClose, onSave, roomToEdit }: RoomModalProps) => {
  const [formData, setFormData] = useState<Room>(emptyRoom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationManual, setIsLocationManual] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(roomToEdit || emptyRoom);
      setIsLocationManual(!!roomToEdit);
    }
  }, [open, roomToEdit]);

  const handleChange = (field: keyof Room, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "name" && !isLocationManual) {
        newData.location = generateLocation(value as string);
      }

      return newData;
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsLocationManual(true);
    setFormData((prev) => ({ ...prev, location: value }));
  };

  const isInvalid = !formData.name.trim() || formData.capacity <= 0;

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
      title={roomToEdit ? "Editează Sala" : "Adaugă Sală Nouă"}
      onSubmit={handleSubmit}
      submitLabel={
        isSubmitting ? "Se salvează..." : roomToEdit ? "Editează" : "Adaugă"
      }
      disabled={isInvalid || isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formField}>
          <label htmlFor="room-name">Nume</label>
          <input
            id="room-name"
            type="text"
            value={formData.name}
            placeholder="ex: V202"
            onChange={(e) => handleChange("name", e.target.value.toUpperCase())}
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="room-location">Locație</label>
          <input
            id="room-location"
            type="text"
            value={formData.location}
            placeholder="ex: Corp V, Etaj 2, Sala 2"
            onChange={handleLocationChange}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="room-type">Tip</label>
          <select
            id="room-type"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value as RoomType)}
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="room-capacity">Capacitate</label>
          <input
            id="room-capacity"
            type="number"
            min="1"
            value={formData.capacity || ""}
            placeholder="ex: 100"
            onChange={(e) =>
              handleChange("capacity", parseInt(e.target.value) || 0)
            }
          />
        </div>
        <button type="submit" style={{ display: "none" }} />
      </form>
    </BaseModal>
  );
};

export default RoomModal;
