import { DataTable } from "@/components/dataTable/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Room } from "@/types/Room.types";
import { columns } from "./RoomsColumns";

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

      <DataTable
        columns={columns}
        data={MOCK_ROOMS}
        title="Listă Săli"
        searchPlaceholder="Caută sală..."
      />
    </>
  );
};

export default Rooms;
