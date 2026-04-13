import { groupService } from "@/services/groupService";
import type { Group, GroupDTO } from "@/types/Group.types";
import { useState } from "react";
import toast from "react-hot-toast";

const useGroupsActions = (refetch: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleOpenAdd = () => {
    setGroupToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (group: Group) => {
    setGroupToEdit(group);
    setIsModalOpen(true);
  };

  const handleOpenConfirmDelete = (group: Group) => {
    setGroupToDelete(group);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      // DELETE
      setIsActionLoading(true);
      try {
        await groupService.delete(groupToDelete.id);

        toast.success(
          `Grupa ${groupToDelete.identifier} a fost ștearsă cu succes.`,
        );
        refetch();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea grupei.");
      } finally {
        setIsActionLoading(false);
        setGroupToDelete(null);
      }
    }
  };

  const handleSave = async (formData: GroupDTO) => {
    setIsActionLoading(true);
    try {
      if (groupToEdit) {
        // EDIT
        await groupService.update({ ...formData, id: groupToEdit.id });

        toast.success("Grupa a fost modificată cu succes.");
        refetch();
      } else {
        // ADD
        await groupService.create(formData);

        toast.success("Grupa a fost adăugată cu succes.");
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Eroare la salvarea grupei.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    state: {
      isModalOpen,
      groupToEdit,
      groupToDelete,
      isActionLoading,
    },
    actions: {
      setIsModalOpen,
      handleSave,
      handleOpenAdd,
      handleOpenEdit,
      setGroupToDelete,
      handleOpenConfirmDelete,
      handleConfirmDelete,
    },
  };
};

export default useGroupsActions;
