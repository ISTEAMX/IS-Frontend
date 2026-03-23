import type { Room } from "@/types/Room.types";
import type { ColumnDef } from "@tanstack/react-table";
import styles from "./RoomsColumns.module.css";
import { BiEdit, BiTrash } from "react-icons/bi";

export const getColumns = (
  onEdit: (room: Room) => void,
  onDelete: (id: string) => void,
): ColumnDef<Room>[] => [
  {
    accessorKey: "name",
    header: "Denumire Sală",
    cell: ({ row }) => (
      <div>
        <div className={styles.roomName}>{row.original.name}</div>
        <div className={styles.roomLocation}>{row.original.location}</div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tip",
    cell: ({ row }) => {
      const roomType = row.original.type.toLowerCase();

      return (
        <span className={`${styles.roomTypeBadge} ${styles[roomType] || ""}`}>
          {row.original.type}
        </span>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacitate",
    cell: ({ row }) => (
      <span
        className={styles.roomCapacity}
      >{`${row.original.capacity} locuri`}</span>
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
          onClick={() => onDelete(row.original.id)}
        >
          <BiTrash className={styles.icon} />
        </button>
      </div>
    ),
  },
];
