import { Eye } from "lucide-react";

export default function MobileDashboardCard({
    item,
    user,
    updateStatus,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100">
            {item.image ? (
                <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                />
            ) : (
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Tidak ada gambar</p>
                </div>
            )}

            <div className="p-5">
                <div className="flex justify-between gap-3 items-start">
                    <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                    <StatusBadge status={item.status} />
                </div>

                <p className="text-sm text-blue-700 font-semibold mt-2">
                    {item.category_name}
                </p>

                <p className="text-gray-600 mt-3 line-clamp-3">{item.description}</p>

                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-400">Pelapor</p>
                        <p className="font-semibold text-gray-700">{item.user_name}</p>
                    </div>

                    <a
                        href={`/laporan/${item.id}`}
                        className="bg-blue-700 text-white px-3 py-2 rounded-xl text-sm hover:bg-blue-800 flex items-center gap-2"
                    >
                        <Eye size={16} />
                        Detail
                    </a>
                </div>

                {(user?.role === "admin" || user?.role === "super_admin") && (
                    <div className="flex gap-2 mt-5 pt-5 border-t">
                        <button
                            onClick={() => updateStatus(item.id, "approved")}
                            className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                            type="button"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => updateStatus(item.id, "rejected")}
                            className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700"
                            type="button"
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const style =
        status === "approved"
            ? "bg-green-100 text-green-700"
            : status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${style}`}>
            {status}
        </span>
    );
}

