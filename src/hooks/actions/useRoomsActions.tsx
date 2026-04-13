import { roomService } from "@/services/roomService";
import type { Room, RoomDTO } from "@/types/Room.types";
import { useState } from "react";
import toast from "react-hot-toast";

const useRoomsActions = (refetch: () => void) => {
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

  return {
    state: { isModalOpen, roomToEdit, roomToDelete, isActionLoading },
    actions: {
      setIsModalOpen,
      handleOpenAdd,
      handleSave,
      handleOpenEdit,
      setRoomToDelete,
      handleOpenConfirmDelete,
      handleConfirmDelete,
    },
  };
};

export default useRoomsActions;
