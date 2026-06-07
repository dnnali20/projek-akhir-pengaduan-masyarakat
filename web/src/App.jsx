import { Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateLaporan from "./pages/CreateLaporan";
import DetailLaporan from "./pages/DetailLaporan";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import Categories from "./pages/Categories";
import RiwayatLaporan from "./pages/RiwayatLaporan";
import Profile from "./pages/Profile";
import Statistik from "./pages/Statistik";
import Notifications from "./pages/Notifications";
import LandingPage from "./pages/LandingPage";
import ActivityLogs from "./pages/ActivityLogs";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan/create"
        element={
          <ProtectedRoute>
            <CreateLaporan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan/:id"
        element={
          <ProtectedRoute>
            <DetailLaporan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />

      <Route
        path="/riwayat"
        element={
          <ProtectedRoute>
            <RiwayatLaporan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/statistik"
        element={
          <ProtectedRoute>
            <Statistik />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}