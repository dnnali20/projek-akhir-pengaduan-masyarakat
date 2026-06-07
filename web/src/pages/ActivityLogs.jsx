import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../components/Layout";
import API from "../api/api";

export default function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;
        getLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLogs = async () => {
        try {
            const res = await API.get("/activity-logs/");
            setLogs(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Gagal mengambil activity log");
        }
    };

    if (user?.role !== "admin" && user?.role !== "super_admin") {
        return (
            <Layout>
                <Toaster position="top-right" />
                <div className="bg-white rounded-3xl shadow p-10 text-center">
                    <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
                    <p className="text-gray-500 mt-2">Hanya admin/super_admin yang bisa melihat activity log.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Activity Log Admin</h1>
                        <p className="text-gray-500 mt-2">Riwayat aktivitas terbaru terkait laporan.</p>
                    </div>

                    <button
                        onClick={getLogs}
                        className="bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-blue-800"
                    >
                        Refresh
                    </button>
                </div>

                {logs.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow p-10 text-center">
                        <p className="text-gray-500">Belum ada activity log.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow p-5 overflow-hidden">
                        <div className="overflow-auto max-h-[70vh]">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-left">
                                        <th className="p-4 font-semibold text-gray-700">Waktu</th>
                                        <th className="p-4 font-semibold text-gray-700">Admin/User</th>
                                        <th className="p-4 font-semibold text-gray-700">Role</th>
                                        <th className="p-4 font-semibold text-gray-700">Laporan</th>
                                        <th className="p-4 font-semibold text-gray-700">Action</th>
                                        <th className="p-4 font-semibold text-gray-700">Deskripsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((item) => (
                                        <tr key={item.id} className="border-t border-gray-100">
                                            <td className="p-4 text-gray-600">{new Date(item.created_at).toLocaleString("id-ID")}</td>
                                            <td className="p-4 font-semibold text-gray-800">{item.user_name || "-"}</td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                                    {item.user_role || "-"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-700">{item.laporan_title || "-"}</td>
                                            <td className="p-4 font-semibold text-gray-800">{item.action || "-"}</td>
                                            <td className="p-4 text-gray-600 whitespace-pre-line">{item.description || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

