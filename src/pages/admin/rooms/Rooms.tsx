import { useState } from "react";
import { DataTable } from "@/components/dataTable/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import RoomModal from "@/components/ui/RoomModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { Room } from "@/types/Room.types";
import { calculateTotalCapacity } from "@/utils/roomUtils";
import { MOCK_ROOMS } from "@/mocks/rooms";
import { getColumns } from "./RoomsColumns";
import styles from "../Page.module.css";

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
