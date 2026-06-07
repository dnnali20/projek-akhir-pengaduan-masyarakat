import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  LogOut,
  Tags,
  History,
  UserCircle,
  BarChart3,
  Bell,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-blue-800 text-white p-6 hidden md:block">
      <h1 className="text-2xl font-bold mb-10">Pengaduan</h1>

      <nav className="space-y-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        {user?.role === "user" && (
          <Link
            to="/laporan/create"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            Tambah Laporan
          </Link>
        )}

        {user?.role === "user" && (
          <Link
            to="/riwayat"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
          >
            <History size={20} />
            Riwayat Laporan
          </Link>
        )}

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <Link
            to="/categories"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
          >
            <Tags size={20} />
            Kategori
          </Link>
        )}

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <Link
            to="/statistik"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
          >
            <BarChart3 size={20} />
            Statistik
          </Link>
        )}

        {user?.role === "super_admin" && (
          <Link
            to="/users"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
          >
            <Users size={20} />
            Kelola User
          </Link>
        )}

        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
        >
          <UserCircle size={20} />
          Profile
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-600 w-full text-left"
        >
          <LogOut size={20} />
          Logout
        </button>

        <Link
          to="/notifications"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
        >
          <Bell size={20} />
          Notifikasi
        </Link>

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <Link
            to="/activity-logs"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700"
          >
            <span className="inline-flex items-center justify-center w-5">📝</span>
            Activity Log
          </Link>
        )}
      </nav>
    </aside>
  );
}
