import { Mail, Shield, Edit } from "lucide-react";

export default function MobileProfileHeader({ user, roleLabel, photoUrl, onEdit }) {
  const theme =
    user?.role === "super_admin"
      ? "from-purple-800 to-fuchsia-600"
      : user?.role === "admin"
      ? "from-emerald-700 to-green-500"
      : "from-blue-800 to-blue-500";

  return (
    <div className="md:hidden mb-6">
      <div className={`bg-gradient-to-r ${theme} rounded-3xl p-6 text-white shadow-lg`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>

          <div className="flex items-center gap-2 mt-2 text-white/90 text-sm">
            <Mail size={16} />
            <span className="break-all">{user?.email}</span>
          </div>

          <div className="mt-4 flex gap-3">
            <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold">
              <Shield size={16} />
              {roleLabel}
            </div>

            <button
              onClick={onEdit}
              className="bg-white text-blue-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold"
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}