import type {
  EventFrequency,
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import { useEffect, useMemo, useRef, useState } from "react";
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
import SearchableSelect from "./SearchableSelect";
import MultiSearchableSelect from "./MultiSearchableSelect";
import { FiAlertCircle, FiMapPin, FiTag, FiTrash2 } from "react-icons/fi";
import {
  BiBook,
  BiCalendar,
  BiRepeat,
  BiSolidHourglassBottom,
  BiSolidHourglassTop,
  BiUser,
} from "react-icons/bi";
import { useAuthStore } from "@/store/useAuthStore";

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
  const user = useAuthStore((state) => state.userData);
  const isProfessor = user?.role === "PROFESSOR";
  const professorIdFromStore = user?.professorId;

  const mapInitialData = (
    data: ScheduleEvent | Partial<ScheduleEvent> | null | undefined,
  ): ScheduleEventDTO => ({
    id: (data as ScheduleEvent)?.id || undefined,
    subjectId: (data as ScheduleEvent)?.subjectDTO?.id || 0,
    professorId: isProfessor
      ? professorIdFromStore || 0
      : (data as ScheduleEvent)?.professorDTO?.id || 0,
    roomId: (data as ScheduleEvent)?.roomDTO?.id || 0,
    groupIds: (data as ScheduleEvent)?.groups?.map((g) => g.id) || [],
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

  // Determine if the selected subject is a "Curs"
  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === formData.subjectId),
    [subjects, formData.subjectId],
  );
  const isCurs = selectedSubject?.activityType === "Curs";

  const startHourOptions = HOURS.slice(0, -1);
  const endHourOptions = HOURS.filter(
    (h) =>
      h > (formData.startingHour || 0) && h <= (formData.startingHour || 0) + 2,
  );

  const duration = (formData.endingHour || 0) - (formData.startingHour || 0);
  const hasGroup = formData.groupIds && formData.groupIds.length > 0;
  const isValid =
    formData.subjectId &&
    formData.roomId &&
    hasGroup &&
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
          <SearchableSelect
            options={subjects}
            getLabel={(s) => `${s.name} (${s.activityType})`}
            getValue={(s) => s.id}
            placeholder="Selectează Disciplina"
            value={formData.subjectId || undefined}
            onChange={(val) => {
              const newSubjectId = val ? Number(val) : 0;
              const newSubject = subjects.find((s) => s.id === newSubjectId);
              const switchingToCurs = newSubject?.activityType === "Curs";
              const switchingFromCurs = isCurs && !switchingToCurs;

              setFormData({
                ...formData,
                subjectId: newSubjectId,
                // Reset group selection when switching between Curs and non-Curs
                ...(switchingFromCurs || (switchingToCurs && !isCurs)
                  ? { groupIds: [] }
                  : {}),
              });
            }}
          />
        </div>

        {!isProfessor && (
          <div className={styles.formField}>
            <label className={styles.label}>
              <BiUser className={styles.icon} />
              Profesor
            </label>
            <SearchableSelect
              options={teachers}
              getLabel={(t) => `${t.lastName} ${t.firstName}`}
              getValue={(t) => t.id}
              placeholder="Selectează Profesorul"
              value={formData.professorId || undefined}
              onChange={(val) =>
                setFormData({ ...formData, professorId: val ? Number(val) : 0 })
              }
            />
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>
              <FiMapPin className={styles.icon} />
              Sală
            </label>
            <SearchableSelect
              options={rooms}
              getLabel={(r) => r.name}
              getValue={(r) => r.id}
              placeholder="Selectează Sala"
              value={formData.roomId || undefined}
              onChange={(val) =>
                setFormData({ ...formData, roomId: val ? Number(val) : 0 })
              }
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>
              <FiTag className={styles.icon} />
              {isCurs ? "Grupe" : "Grupă"}
            </label>
            {isCurs ? (
              <MultiSearchableSelect
                options={groups}
                getLabel={(g) => g.identifier}
                getValue={(g) => g.id}
                placeholder="Selectează Grupele"
                values={formData.groupIds || []}
                onChange={(vals) =>
                  setFormData({
                    ...formData,
                    groupIds: vals.map(Number),
                  })
                }
              />
            ) : (
              <SearchableSelect
                options={groups}
                getLabel={(g) => g.identifier}
                getValue={(g) => g.id}
                placeholder="Selectează Grupa"
                value={formData.groupIds?.[0] || undefined}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    groupIds: val ? [Number(val)] : [],
                  })
                }
              />
            )}
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
