import type {
  EventFrequency,
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import { useEffect, useRef, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModalForm.module.css";
import {
  DAYS,
  EVENT_FREQUENCIES,
  EVENT_FREQUENCY_LABELS,
  HOURS,
} from "@/constants/timetable.constants";
import useRooms from "@/hooks/api/useRooms";
import useSubjects from "@/hooks/api/useSubjects";
import useGroups from "@/hooks/api/useGroups";
import useTeachers from "@/hooks/api/useTeachers";
import { FiAlertCircle, FiMapPin, FiTag, FiTrash2 } from "react-icons/fi";
import {
  BiBook,
  BiCalendar,
  BiRepeat,
  BiSolidHourglassBottom,
  BiSolidHourglassTop,
  BiUser,
} from "react-icons/bi";

interface ScheduleEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ScheduleEventDTO) => void;
  onDelete?: (id: number) => void;
  initialData?: ScheduleEvent | null;
  conflict?: string | null;
}

const ScheduleEventModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialData,
  conflict,
}: ScheduleEventModalProps) => {
  const mapInitialData = (
    data: ScheduleEvent | Partial<ScheduleEvent> | null | undefined,
  ): ScheduleEventDTO => ({
    id: (data as ScheduleEvent)?.id || undefined,
    subjectId: (data as ScheduleEvent)?.subjectDTO?.id || 0,
    professorId: (data as ScheduleEvent)?.professorDTO?.id || 0,
    roomId: (data as ScheduleEvent)?.roomDTO?.id || 0,
    groupId: (data as ScheduleEvent)?.groupDTO?.id || 0,
    scheduleDay: data?.scheduleDay || "Luni",
    startingHour: data?.startingHour || 8,
    endingHour: data?.endingHour || 10,
    frequency: data?.frequency || "SAPTAMANAL",
  });

  const isEditing = !!initialData?.id;

  const { rooms } = useRooms();
  const { subjects } = useSubjects();
  const { groups } = useGroups();
  const { teachers } = useTeachers();

  const [formData, setFormData] = useState<ScheduleEventDTO>(
    mapInitialData(initialData),
  );

  const startHourOptions = HOURS.slice(0, -1);
  const endHourOptions = HOURS.filter(
    (h) =>
      h > (formData.startingHour || 0) && h <= (formData.startingHour || 0) + 2,
  );

  const duration = (formData.endingHour || 0) - (formData.startingHour || 0);
  const isValid =
    formData.subjectId &&
    formData.roomId &&
    formData.groupId &&
    formData.professorId &&
    duration > 0 &&
    duration <= 2;

  const conflictRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conflict && conflictRef.current) {
      conflictRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [conflict]);

  return (
    <BaseModal
      open={open}
      title={isEditing ? "Editează Activitatea" : "Activitate Nouă"}
      onClose={onClose}
      onSubmit={() => onSave(formData)}
      submitLabel={isEditing ? "Editează" : "Adaugă"}
      disabled={!isValid}
    >
      <div className={styles.formContainer}>
        <div className={styles.formField}>
          <label className={styles.label}>
            <BiCalendar className={styles.icon} /> Ziua
          </label>
          <select
            className={styles.select}
            value={formData.scheduleDay}
            onChange={(e) =>
              setFormData({
                ...formData,
                scheduleDay: e.target.value as (typeof DAYS)[number],
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
            <label className={styles.label}>
              <BiSolidHourglassTop className={styles.icon} />
              Ora Început
            </label>
            <select
              className={styles.select}
              value={formData.startingHour}
              onChange={(e) => {
                const newStart = parseInt(e.target.value);
                const currentEnd = formData.endingHour || 10;

                let newEnd = currentEnd;
                if (currentEnd <= newStart || currentEnd > newStart + 2) {
                  newEnd = newStart + 2 > 21 ? 21 : newStart + 2;
                }

                setFormData({
                  ...formData,
                  startingHour: newStart,
                  endingHour: newEnd,
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
            <label className={styles.label}>
              <BiSolidHourglassBottom className={styles.icon} />
              Ora Sfârșit
            </label>
            <select
              className={styles.select}
              value={formData.endingHour}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endingHour: parseInt(e.target.value),
                })
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
          <label className={styles.label}>
            <BiBook className={styles.icon} />
            Disciplină
          </label>
          <select
            className={styles.input}
            value={formData.subjectId}
            onChange={(e) =>
              setFormData({ ...formData, subjectId: parseInt(e.target.value) })
            }
          >
            <option value="">Selectează Disciplina</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.activityType})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>
            <BiUser className={styles.icon} />
            Profesor
          </label>
          <select
            className={styles.input}
            value={formData.professorId}
            onChange={(e) =>
              setFormData({
                ...formData,
                professorId: parseInt(e.target.value),
              })
            }
          >
            <option value="">Selectează Profesorul</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.lastName + " " + t.firstName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>
              <FiMapPin className={styles.icon} />
              Sală
            </label>
            <select
              className={styles.input}
              value={formData.roomId}
              onChange={(e) =>
                setFormData({ ...formData, roomId: parseInt(e.target.value) })
              }
            >
              <option value="">Selectează Sala</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>
              <FiTag className={styles.icon} />
              Grupă
            </label>
            <select
              className={styles.input}
              value={formData.groupId}
              onChange={(e) =>
                setFormData({ ...formData, groupId: parseInt(e.target.value) })
              }
            >
              <option value="">Selectează Grupa</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.identifier}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>
            <BiRepeat className={styles.icon} />
            Frecvență
          </label>
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
                {EVENT_FREQUENCY_LABELS[f]}
              </option>
            ))}
          </select>
        </div>

        {initialData?.id && onDelete && (
          <div className={styles.deleteSection}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDelete(initialData.id!)}
            >
              <FiTrash2 /> Șterge Activitatea
            </button>

            <p className={styles.deleteText}>
              Această acțiune este ireversibilă.
            </p>
          </div>
        )}
      </div>

      {conflict && (
        <div ref={conflictRef} className={styles.conflictAlert}>
          <FiAlertCircle className={styles.alertIcon} />
          <span>{conflict}</span>
        </div>
      )}
    </BaseModal>
  );
};

export default ScheduleEventModal;
