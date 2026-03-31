import { PageHeader } from "@/components/ui/PageHeader";
import { useNavigate } from "react-router-dom";

const Teachers = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Profesori" onAddClick={() => navigate("/admin/register")} />
    </>
  );
};

export default Teachers;
