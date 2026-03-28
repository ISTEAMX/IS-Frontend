import type {
  EventFrequency,
  ScheduleEvent,
} from "@/types/ScheduleEvent.types";
import { useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModalForm.module.css";
import {
  DAYS,
  EVENT_FREQUENCIES,
  HOURS,
} from "@/constants/timetable.constants";

interface ScheduleEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ScheduleEvent>) => void;
  initialData?: ScheduleEvent | null;
}

const DEFAULT_FORM_STATE: Partial<ScheduleEvent> = {
  name: "",
  type: "Curs",
  day: "Luni",
  startHour: 8,
  endHour: 10,
  frequency: "săptămânal",
};

const ScheduleEventModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: ScheduleEventModalProps) => {
  const [formData, setFormData] = useState<Partial<ScheduleEvent>>(
    initialData || DEFAULT_FORM_STATE,
  );

  const startHourOptions = HOURS.slice(0, -1);
  const endHourOptions = HOURS.filter(
    (h) => h > (formData.startHour || 0) && h <= (formData.startHour || 0) + 2,
  );

  const duration = (formData.endHour || 0) - (formData.startHour || 0);
  const isValid =
    formData.name && formData.name.length > 2 && duration > 0 && duration <= 2;

  return (
    <BaseModal
      open={open}
      title={initialData ? "Editează Activitatea" : "Activitate Nouă"}
      onClose={onClose}
      onSubmit={() => onSave(formData)}
      submitLabel={initialData ? "Editează" : "Adaugă"}
      disabled={!isValid}
    >
      {/*Placeholder form, text inputs will be replaced with selects */}
      <div className={styles.formContainer}>
        <div className={styles.formField}>
          <label className={styles.label}>Ziua</label>
          <select
            className={styles.select}
            value={formData.day}
            onChange={(e) =>
              setFormData({
                ...formData,
                day: e.target.value as (typeof DAYS)[number],
              })
            }
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Ora Început</label>
            <select
              className={styles.select}
              value={formData.startHour}
              onChange={(e) => {
                const newStart = parseInt(e.target.value);
                const currentEnd = formData.endHour || 10;

                let newEnd = currentEnd;
                if (currentEnd <= newStart || currentEnd > newStart + 2) {
                  newEnd = newStart + 2 > 21 ? 21 : newStart + 2;
                }

                setFormData({
                  ...formData,
                  startHour: newStart,
                  endHour: newEnd,
                });
              }}
            >
              {startHourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Ora Sfârșit</label>
            <select
              className={styles.select}
              value={formData.endHour}
              onChange={(e) =>
                setFormData({ ...formData, endHour: parseInt(e.target.value) })
              }
            >
              {endHourOptions.map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Disciplină</label>
          <input
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Sisteme de Operare"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Sală</label>
            <input
              className={styles.input}
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              placeholder="Ex: V202"
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Grupă</label>
            <input
              className={styles.input}
              value={formData.group}
              onChange={(e) =>
                setFormData({ ...formData, group: e.target.value })
              }
              placeholder="Ex: 1631"
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Frecvență</label>
          <select
            className={styles.select}
            value={formData.frequency}
            onChange={(e) =>
              setFormData({
                ...formData,
                frequency: e.target.value as EventFrequency,
              })
            }
          >
            {EVENT_FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScheduleEventModal;
