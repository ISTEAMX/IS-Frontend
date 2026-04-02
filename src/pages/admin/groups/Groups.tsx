import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { Group, GroupDTO } from "@/types/Group.types";
import { getColumns } from "./GroupsColumns";
import styles from "../Page.module.css";
import GroupModal from "@/components/ui/GroupModal";
import useGroups from "@/hooks/useGroups";
import api from "@/api/axiosInstance";
import toast from "react-hot-toast";

const Groups = () => {
  const { groups, isLoading, refetch } = useGroups();

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
        await api.delete(`/group/delete/${groupToDelete.id}`);
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
        await api.put("/group/update", {
          ...formData,
          id: groupToEdit.id,
        });

        toast.success("Grupa a fost modificată cu succes.");
        refetch();
      } else {
        // ADD
        await api.post("/group/create", formData);

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

  const tableColumns = getColumns(handleOpenEdit, handleOpenConfirmDelete);

  return (
    <>
      <PageHeader title="Grupe" onAddClick={handleOpenAdd} />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard
            title="Total Grupe"
            info={isLoading ? "..." : groups.length}
          />
        </div>

        <DataTable
          columns={tableColumns}
          data={groups}
          title="Listă Grupe"
          searchPlaceholder="Caută grupă..."
          isLoading={isLoading}
        />

        <GroupModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          groupToEdit={groupToEdit}
        />

        <ConfirmModal
          open={!!groupToDelete}
          title={`Ștergi grupa ${groupToDelete?.identifier}?`}
          description="Această acțiune nu va putea fi anulată."
          onClose={() => setGroupToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isActionLoading}
        />
      </div>
    </>
  );
};

export default Groups;
