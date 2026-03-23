import { DataTable } from "@/components/dataTable/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Room } from "@/types/Room.types";
import { getColumns } from "./RoomsColumns";
import RoomModal from "@/components/ui/RoomModal";
import { useState } from "react";
import styles from "./Rooms.module.css";
import InfoCard from "@/components/ui/InfoCard";
import { calculateTotalCapacity } from "@/utils/roomUtils";
import ConfirmModal from "@/components/ui/ConfirmModal";

// Mock Data
const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "A101",
    location: "Corp A, Etaj 1",
    type: "Amfiteatru",
    capacity: 150,
  },
  {
    id: "2",
    name: "L204",
    location: "Corp B, Etaj 2",
    type: "Laborator",
    capacity: 25,
  },
  {
    id: "3",
    name: "A102",
    location: "Corp A, Etaj 1",
    type: "Seminar",
    capacity: 100,
  },
];

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const handleOpenAdd = () => {
    setRoomToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setRoomToEdit(room);
    setIsModalOpen(true);
  };

  const handleOpenConfirmDelete = (room: Room) => {
    setRoomToDelete(room);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      // Simulate DELETE
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
      setRoomToDelete(null);
    }
  };

  const handleSave = (formData: Room) => {
    if (roomToEdit) {
      // Simulate EDIT
      setRooms((prev) =>
        prev.map((r) => (r.id === formData.id ? formData : r)),
      );
    } else {
      // Simulate ADD
      const newRoom = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setIsModalOpen(false);
  };

  const tableColumns = getColumns(handleOpenEdit, handleOpenConfirmDelete);

  return (
    <>
      <PageHeader title="Săli" onAddClick={handleOpenAdd} />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard title="Total Săli" info={rooms.length} />
          <InfoCard
            title="Capacitate Totală"
            info={calculateTotalCapacity(rooms)}
          />
        </div>

        <DataTable
          columns={tableColumns}
          data={rooms}
          title="Listă Săli"
          searchPlaceholder="Caută sală..."
        />

        <RoomModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          roomToEdit={roomToEdit}
        />

        <ConfirmModal
          open={!!roomToDelete}
          title={`Ștergi sala ${roomToDelete?.name}?`}
          description="Această acțiune nu va putea fi anulată."
          onClose={() => setRoomToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
};

export default Rooms;
