import { DataTable } from "@/components/dataTable/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import RoomModal from "@/components/ui/RoomModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { calculateTotalCapacity } from "@/utils/roomUtils";
import { getColumns } from "./RoomsColumns";
import styles from "../Page.module.css";
import useRooms from "@/hooks/api/useRooms";
import useRoomsActions from "@/hooks/actions/useRoomsActions";

const Rooms = () => {
  const { rooms, isLoading, refetch } = useRooms();
  const {
    state: { isModalOpen, roomToDelete, roomToEdit, isActionLoading },
    actions: {
      handleOpenEdit,
      handleOpenConfirmDelete,
      handleOpenAdd,
      setIsModalOpen,
      handleSave,
      setRoomToDelete,
      handleConfirmDelete,
    },
  } = useRoomsActions(refetch);

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
