import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUP from "./pages/Auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import Dashboard from "./pages/Admin/Dashboard";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import UserProvider, { UserProviderContext } from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUP />} />

            {/* Admin Routes (Protected) */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* User Routes  */}

            <Route element={<PrivateRoute allowedRoles={["member"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:id"
                element={<ViewTaskDetails />}
              />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />}></Route>
          </Routes>
        </Router>
        {/* Footer/Credit Section */}
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            fontSize: "12px",
            color: "#555",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "5px 10px",
            borderRadius: "20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          Developed by{" "}
          <a
            href="https://www.linkedin.com/in/rakib-islam-rifatt/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0077b5", // LinkedIn blue color
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Rakib Islam Rifat
          </a>
        </div>
      </div>

      <Toaster
        toashtOptions={{
          className: "",
          style: {
            fontSize: "14px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserProviderContext);
  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login"></Navigate>;
  }
  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
