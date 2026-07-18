import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// User Pages
import Users from "../pages/users/Users";
import UserDetails from "../pages/users/UserDetails";
import CreateUser from "../pages/users/CreateUser";
import EditUser from "../pages/users/EditUser";

// Team Pages
import Teams from "../pages/teams/Teams";
import TeamDetails from "../pages/teams/TeamDetails";
import CreateTeam from "../pages/teams/CreateTeam";
import EditTeam from "../pages/teams/EditTeam";

// Task Pages
import Tasks from "../pages/tasks/Tasks";
import TaskDetails from "../pages/tasks/TaskDetails";
import CreateTask from "../pages/tasks/CreateTask";
import EditTask from "../pages/tasks/EditTask";
// Main Pages
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "users/new", element: <CreateUser /> },
      { path: "users/:id", element: <UserDetails /> },
      { path: "users/:id/edit", element: <EditUser /> },
      { path: "teams", element: <Teams /> },
      { path: "teams/new", element: <CreateTeam /> },
      { path: "teams/:id", element: <TeamDetails /> },
      { path: "teams/:id/edit", element: <EditTeam /> },
      { path: "tasks", element: <Tasks /> },
      { path: "tasks/new", element: <CreateTask /> },
      { path: "tasks/:id", element: <TaskDetails /> },
      { path: "tasks/:id/edit", element: <EditTask /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;