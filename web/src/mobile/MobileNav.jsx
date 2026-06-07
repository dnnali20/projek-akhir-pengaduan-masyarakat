import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Tags,
  Users,
  LogOut,
  History,
  UserCircle,
  Bell,
} from "lucide-react";

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
      isActive(path) ? "text-blue-700" : "text-slate-400"
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl px-3 py-3">
        <div className="flex items-center justify-around gap-2">
          <Link to="/dashboard" className={navClass("/dashboard")}>
            <div
              className={`p-2 rounded-2xl ${
                isActive("/dashboard") ? "bg-blue-100" : ""
              }`}
            >
              <LayoutDashboard size={21} />
            </div>
            Home
          </Link>

          <Link to="/profile" className={navClass("/profile")}>
            <div
              className={`p-2 rounded-2xl ${
                isActive("/profile") ? "bg-blue-100" : ""
              }`}
            >
              <UserCircle size={21} />
            </div>
            Profil
          </Link>

          {user?.role === "user" && (
            <Link
              to="/laporan/create"
              className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-blue-700 -mt-8"
            >
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/40 border-4 border-white">
                <PlusCircle size={28} />
              </div>
              Lapor
            </Link>
          )}

          {user?.role === "user" && (
            <Link to="/riwayat" className={navClass("/riwayat")}>
              <div
                className={`p-2 rounded-2xl ${
                  isActive("/riwayat") ? "bg-blue-100" : ""
                }`}
              >
                <History size={21} />
              </div>
              Riwayat
            </Link>
          )}

          {(user?.role === "admin" || user?.role === "super_admin") && (
            <Link to="/categories" className={navClass("/categories")}>
              <div
                className={`p-2 rounded-2xl ${
                  isActive("/categories") ? "bg-blue-100" : ""
                }`}
              >
                <Tags size={21} />
              </div>
              Kategori
            </Link>
          )}

          {user?.role === "super_admin" && (
            <Link to="/users" className={navClass("/users")}>
              <div
                className={`p-2 rounded-2xl ${
                  isActive("/users") ? "bg-blue-100" : ""
                }`}
              >
                <Users size={21} />
              </div>
              User
            </Link>
          )}

          <Link to="/notifications" className={navClass("/notifications")}>
            <div
              className={`relative p-2 rounded-2xl ${
                isActive("/notifications") ? "bg-blue-100" : ""
              }`}
            >
              <Bell size={21} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            Notif
          </Link>

          <button
            onClick={logout}
            className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-red-500"
          >
            <div className="p-2 rounded-2xl">
              <LogOut size={21} />
            </div>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}