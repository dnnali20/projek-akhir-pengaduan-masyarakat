import { Bell, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileHeader({ title, subtitle }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="md:hidden mb-5">
      <div className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-3xl p-5 text-white shadow-lg">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-blue-100 text-sm">
              Halo, {user?.name || "User"}
            </p>

            <h1 className="text-2xl font-bold mt-1">
              {title}
            </h1>

            {subtitle && (
              <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              to="/notifications"
              className="bg-white/20 p-3 rounded-2xl relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            <Link
              to="/profile"
              className="bg-white/20 p-3 rounded-2xl"
            >
              <UserCircle size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}