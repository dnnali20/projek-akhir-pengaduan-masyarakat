import { Link } from "react-router-dom";
import { Eye, MapPin } from "lucide-react";

export default function MobileDashboardCard({ item, user, updateStatus }) {
  const statusStyle =
    item.status === "approved"
      ? "bg-green-100 text-green-700"
      : item.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
      {item.image ? (
        <img
          src={`http://localhost:5000/uploads/${item.image}`}
          alt={item.title}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="h-44 bg-slate-100 flex items-center justify-center">
          <p className="text-slate-400 text-sm">Tidak ada gambar</p>
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between gap-3 items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-800 line-clamp-2">
              {item.title}
            </h2>

            <p className="text-sm text-blue-700 font-semibold mt-1">
              {item.category_name || "Tanpa Kategori"}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle}`}>
            {item.status}
          </span>
        </div>

        <p className="text-slate-500 mt-3 line-clamp-3 text-sm leading-relaxed">
          {item.description}
        </p>

        {item.location_address && (
          <div className="mt-4 bg-blue-50 text-blue-700 rounded-2xl p-3 flex gap-2 text-sm">
            <MapPin size={18} className="shrink-0 mt-0.5" />
            <span className="line-clamp-2">{item.location_address}</span>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Pelapor</p>
            <p className="font-bold text-slate-700 text-sm">
              {item.user_name || "-"}
            </p>
          </div>

          <Link
            to={`/laporan/${item.id}`}
            className="bg-blue-700 text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2"
          >
            <Eye size={16} />
            Detail
          </Link>
        </div>

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t">
            <button
              onClick={() => updateStatus(item.id, "approved")}
              className="bg-green-600 text-white py-2 rounded-2xl font-semibold text-sm"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(item.id, "rejected")}
              className="bg-red-600 text-white py-2 rounded-2xl font-semibold text-sm"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}