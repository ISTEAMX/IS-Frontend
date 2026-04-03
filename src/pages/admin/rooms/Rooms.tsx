import { useState } from "react";
import { DataTable } from "@/components/dataTable/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import RoomModal from "@/components/ui/RoomModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { Room, RoomDTO } from "@/types/Room.types";
import { calculateTotalCapacity } from "@/utils/roomUtils";
import { getColumns } from "./RoomsColumns";
import styles from "../Page.module.css";
import useRooms from "@/hooks/useRooms";
import toast from "react-hot-toast";
import { roomService } from "@/services/roomService";

const Rooms = () => {
  const { rooms, isLoading, refetch } = useRooms();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (roomToDelete) {
      // DELETE
      setIsActionLoading(true);
      try {
        await roomService.delete(roomToDelete.id);
        
        toast.success(`Sala ${roomToDelete.name} a fost ștearsă cu succes.`);
        refetch();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea sălii.");
      } finally {
        setIsActionLoading(false);
        setRoomToDelete(null);
      }
    }
  };

  const handleSave = async (formData: RoomDTO) => {
    setIsActionLoading(true);
    try {
      if (roomToEdit) {
        // EDIT
        await roomService.update({ ...formData, id: roomToEdit.id });

        toast.success("Sala a fost modificată cu succes.");
        refetch();
      } else {
        // ADD
        await roomService.create(formData);

        toast.success("Sala a fost adăugată cu succes.");
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Eroare la salvarea sălii.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const tableColumns = getColumns(handleOpenEdit, handleOpenConfirmDelete);

  return (
    <>
      <PageHeader title="Săli" onAddClick={handleOpenAdd} />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard
            title="Total Săli"
            info={isLoading ? "..." : rooms.length}
          />
          <InfoCard
            title="Capacitate Totală"
            info={isLoading ? "..." : calculateTotalCapacity(rooms)}
          />
        </div>

        <DataTable
          columns={tableColumns}
          data={rooms}
          title="Listă Săli"
          searchPlaceholder="Caută sală..."
          isLoading={isLoading}
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
          isLoading={isActionLoading}
        />
      </div>
    </>
  );
};

export default Rooms;
