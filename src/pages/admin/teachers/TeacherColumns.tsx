import type { ColumnDef } from "@tanstack/react-table";
import styles from "@/components/dataTable/Columns.module.css";
import { BiEdit, BiTrash } from "react-icons/bi";
import type { Teacher } from "@/types/Teacher.types";

export const getColumns = (
  onEdit: (teacher: Teacher) => void,
  onDelete: (subject: Teacher) => void,
): ColumnDef<Teacher>[] => [
  {
    accessorKey: "lastName",
    header: "Nume",
    cell: ({ row }) => (
      <div>
        <div className={styles.primaryText}>{row.original.lastName}</div>
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Prenume",
    cell: ({ row }) => (
      <div>
        <div className={styles.primaryText}>{row.original.firstName}</div>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Departament",
    cell: ({ row }) => <div>{row.original.department}</div>,
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
