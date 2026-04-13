import { PageHeader } from "@/components/ui/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { DataTable } from "@/components/dataTable/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getColumns } from "./GroupsColumns";
import styles from "../Page.module.css";
import GroupModal from "@/components/ui/GroupModal";
import useGroups from "@/hooks/api/useGroups";
import useGroupsActions from "@/hooks/actions/useGroupsActions";

const Groups = () => {
  const { groups, isLoading, refetch } = useGroups();
  const {
    state: { isModalOpen, groupToEdit, groupToDelete, isActionLoading },
    actions: {
      handleOpenEdit,
      handleOpenConfirmDelete,
      handleOpenAdd,
      setGroupToDelete,
      setIsModalOpen,
      handleSave,
      handleConfirmDelete,
    },
  } = useGroupsActions(refetch);

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
