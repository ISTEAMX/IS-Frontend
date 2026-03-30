import type {
  EventFrequency,
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import { useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModalForm.module.css";
import {
  DAYS,
  EVENT_FREQUENCIES,
  HOURS,
} from "@/constants/timetable.constants";
import { MOCK_SUBJECTS } from "@/mocks/subjects";
import { MOCK_ROOMS } from "@/mocks/rooms";
import { MOCK_GROUPS } from "@/mocks/groups";

interface ScheduleEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ScheduleEventDTO) => void;
  initialData?: ScheduleEvent | null;
}

const ScheduleEventModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: ScheduleEventModalProps) => {
  const mapInitialData = (
    data: ScheduleEvent | null | undefined,
  ): ScheduleEventDTO => ({
    id: data?.id,
    subjectId: data?.subject?.id || "",
    teacherId: data?.teacher?.id || "",
    roomId: data?.room?.id || "",
    groupId: data?.group?.id || "",
    day: data?.day || "Luni",
    startHour: data?.startHour || 8,
    endHour: data?.endHour || 10,
    frequency: data?.frequency || "săptămânal",
  });

  const [formData, setFormData] = useState<ScheduleEventDTO>(
    mapInitialData(initialData),
  );

  const startHourOptions = HOURS.slice(0, -1);
  const endHourOptions = HOURS.filter(
    (h) => h > (formData.startHour || 0) && h <= (formData.startHour || 0) + 2,
  );

  const duration = (formData.endHour || 0) - (formData.startHour || 0);
  const isValid =
    formData.subjectId &&
    formData.roomId &&
    formData.groupId &&
    // formData.teacherId &&
    duration > 0 &&
    duration <= 2;

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
          <select
            className={styles.input}
            value={formData.subjectId}
            onChange={(e) =>
              setFormData({ ...formData, subjectId: e.target.value })
            }
          >
            <option value="">Selectează Disciplina</option>
            {MOCK_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.type})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Sală</label>
            <select
              className={styles.input}
              value={formData.roomId}
              onChange={(e) =>
                setFormData({ ...formData, roomId: e.target.value })
              }
            >
              <option value="">Selectează Sala</option>
              {MOCK_ROOMS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Grupă</label>
            <select
              className={styles.input}
              value={formData.groupId}
              onChange={(e) =>
                setFormData({ ...formData, groupId: e.target.value })
              }
            >
              <option value="">Selectează Grupa</option>
              {MOCK_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
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
