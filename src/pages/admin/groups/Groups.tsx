import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { Group } from "@/types/Group.types";
import { MOCK_GROUPS } from "@/mocks/groups";
import { getColumns } from "./GroupsColumns";
import styles from "../Page.module.css";
import GroupModal from "@/components/ui/GroupModal";

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

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

  const handleConfirmDelete = () => {
    if (groupToDelete) {
      // Simulate DELETE
      setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id));
      setGroupToDelete(null);
    }
  };

  // formData: GroupDTO
  const handleSave = () => {
    if (groupToEdit) {
      // Simulate EDIT
      // setGroups((prev) =>
      //   prev.map((g) => (g.id === groupToEdit.id ? formData : g)),
      // );
    } else {
      // Simulate ADD
      // setGroups((prev) => [...prev, formData]);
    }
    setIsModalOpen(false);
  };

  const tableColumns = getColumns(handleOpenEdit, handleOpenConfirmDelete);

  return (
    <>
      <PageHeader title="Grupe" onAddClick={handleOpenAdd} />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard title="Total Grupe" info={groups.length} />
        </div>

        <DataTable
          columns={tableColumns}
          data={groups}
          title="Listă Grupe"
          searchPlaceholder="Caută grupă..."
        />

        <GroupModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          groupToEdit={groupToEdit}
        />

        <ConfirmModal
          open={!!groupToDelete}
          title={`Ștergi grupa ${groupToDelete?.name}?`}
          description="Această acțiune nu va putea fi anulată."
          onClose={() => setGroupToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
};

export default Groups;
