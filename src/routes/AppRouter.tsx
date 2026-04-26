import { Route, Routes, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/notFound/NotFound";
import Rooms from "@/pages/admin/rooms/Rooms";
import Teachers from "@/pages/admin/teachers/Teachers";
import Groups from "@/pages/admin/groups/Groups";
import Subjects from "@/pages/admin/subjects/Subjects";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "@/pages/changePassword/ChangePassword";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="rooms" replace />} />

          <Route path="rooms" element={<Rooms />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="groups" element={<Groups />} />
          <Route path="subjects" element={<Subjects />} />

          <Route path="register" element={<Register />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
