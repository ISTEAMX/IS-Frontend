import { DataTable } from "@/components/dataTable/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Room } from "@/types/Room.types";
import { columns } from "./RoomsColumns";
import InfoCard from "@/components/ui/InfoCard";
import { calculateTotalCapacity } from "@/utils/roomUtils";
import styles from "./Rooms.module.css";

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
  return (
    <>
      <PageHeader title="Săli" onAddClick={() => {}} />

      <div className={styles.pageWrapper}>
        <div className={styles.cardsContainer}>
          <InfoCard title="Total Săli" info={MOCK_ROOMS.length} />
          <InfoCard
            title="Capacitate Totală"
            info={calculateTotalCapacity(MOCK_ROOMS)}
          />
        </div>

        <DataTable
          columns={columns}
          data={MOCK_ROOMS}
          title="Listă Săli"
          searchPlaceholder="Caută sală..."
        />
      </div>
    </>
  );
};

export default Rooms;
