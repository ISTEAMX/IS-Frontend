import { Route, Routes, Outlet, Navigate, NavLink } from "react-router-dom";

// Page Placeholders
const Login = () => <h2>Login Page</h2>;
const Timetable = () => <h2>Timetable</h2>;
const NotFound = () => <h2>404 Not Found</h2>;

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
      {/* Public routes */}
      <Route path="/" element={<Timetable />} />
      <Route path="/login" element={<Login />} />

      {/* Admin route will be protected */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="rooms" replace />} />

        <Route path="rooms" element={<AdminRooms />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="groups" element={<AdminGroups />} />
        <Route path="subjects" element={<AdminSubjects />} />
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
