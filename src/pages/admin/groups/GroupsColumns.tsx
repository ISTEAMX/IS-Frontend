import type { ColumnDef } from "@tanstack/react-table";
import styles from "@/components/dataTable/Columns.module.css";
import { BiEdit, BiTrash } from "react-icons/bi";
import type { Group } from "@/types/Group.types";

export const getColumns = (
  onEdit: (group: Group) => void,
  onDelete: (group: Group) => void,
): ColumnDef<Group>[] => [
  {
    accessorKey: "identifier",
    header: "Nume",
    cell: ({ row }) => (
      <div>
        <div className={styles.primaryText}>{row.original.identifier}</div>
      </div>
    ),
  },
  {
    accessorKey: "specialization",
    header: "Specializare",
    cell: ({ row }) => (
      <div>
        <div className={styles.metaText}>{row.original.specialization}</div>
      </div>
    ),
  },
  {
    accessorKey: "year",
    header: "An",
    cell: ({ row }) => (
      <div>
        <div className={styles.metaText}>{row.original.year}</div>
      </div>
    ),
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
