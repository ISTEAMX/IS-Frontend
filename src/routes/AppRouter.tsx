import { Route, Routes, Outlet, Navigate, NavLink } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import Login from "@/pages/login/Login";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/notFound/NotFound";

// Admin Layout placeholder
const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <aside
        style={{
          width: "200px",
          background: "#333",
          color: "white",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <h3>Menu</h3>
        <nav
          style={{ display: "flex", flexDirection: "column", color: "white" }}
        >
          <NavLink to="/admin/rooms">Săli</NavLink>
          <NavLink to="/admin/teachers">Profesori</NavLink>
          <NavLink to="/admin/groups">Grupe</NavLink>
          <NavLink to="/admin/subjects">Discipline</NavLink>
        </nav>
      </aside>
      <main style={{ padding: "2rem", flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

// Admin page placeholders
const AdminRooms = () => <h2>Manage Rooms</h2>;
const AdminTeachers = () => <h2>Manage Teachers</h2>;
const AdminGroups = () => <h2>Manage Groups</h2>;
const AdminSubjects = () => <h2>Manage Subjects</h2>;

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Admin route will be protected */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="rooms" replace />} />

        <Route path="rooms" element={<AdminRooms />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="groups" element={<AdminGroups />} />
        <Route path="subjects" element={<AdminSubjects />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
