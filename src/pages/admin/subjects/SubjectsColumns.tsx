import type { Subject } from "@/types/Subject.types";
import type { ColumnDef } from "@tanstack/react-table";
import styles from "@/components/dataTable/Columns.module.css";
import { BiEdit, BiTrash } from "react-icons/bi";

export const getColumns = (
  onEdit: (subject: Subject) => void,
  onDelete: (subject: Subject) => void,
): ColumnDef<Subject>[] => [
  {
    accessorKey: "name",
    header: "Nume",
    cell: ({ row }) => (
      <div>
        <div className={styles.primaryText}>{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: "activityType",
    header: "Tip",
    cell: ({ row }) => {
      const subjectType = row.original.activityType.toLowerCase();

      return (
        <span
          className={`${styles.roomTypeBadge} ${styles[subjectType] || ""}`}
        >
          {row.original.activityType}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acțiuni",
    enableSorting: false,
    cell: ({ row }) => (
      <div className={styles.actionsWrapper}>
        <button
          className={`${styles.actionBtn} ${styles.editBtn}`}
          onClick={() => onEdit(row.original)}
        >
          <BiEdit className={styles.icon} />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(row.original)}
        >
          <BiTrash className={styles.icon} />
        </button>
      </div>
    ),
  },
];
