import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
} from "lucide-react";
import Layout from "../components/Layout";
import API from "../api/api";
import useLaporanRealtime from "../hooks/useLaporanRealtime";
import MobileNotificationCard from "../mobile/MobileNotificationCard";

export default function Notifications() {
  const [laporan, setLaporan] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const getNotifications = async () => {
    try {
      const endpoint =
        user?.role === "user" ? "/laporan/my" : "/laporan/admin";

      const res = await API.get(endpoint);
      setLaporan(res.data);
    } catch {
      console.log("Gagal mengambil notifikasi");
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useLaporanRealtime({
    onLaporkanUpdated: () => {
      getNotifications();
    },
  });

  const notifications = useMemo(() => {
    return laporan.map((item) => {
      if (item.status === "approved") {
        return {
          id: item.id,
          icon: <CheckCircle />,
          title: "Laporan Disetujui",
          message: `Laporan "${item.title}" telah disetujui oleh admin.`,
          color: "bg-green-100 text-green-700",
          link: `/laporan/${item.id}`,
          date: item.resolved_at || item.created_at,
        };
      }

      if (item.status === "rejected") {
        return {
          id: item.id,
          icon: <XCircle />,
          title: "Laporan Ditolak",
          message: `Laporan "${item.title}" ditolak oleh admin.`,
          color: "bg-red-100 text-red-700",
          link: `/laporan/${item.id}`,
          date: item.resolved_at || item.created_at,
        };
      }

      return {
        id: item.id,
        icon: user?.role === "user" ? <Clock /> : <FileText />,
        title:
          user?.role === "user"
            ? "Laporan Menunggu"
            : "Laporan Baru Masuk",
        message:
          user?.role === "user"
            ? `Laporan "${item.title}" masih menunggu peninjauan.`
            : `Ada laporan baru dari ${item.user_name}: "${item.title}".`,
        color: "bg-yellow-100 text-yellow-700",
        link: `/laporan/${item.id}`,
        date: item.created_at,
      };
    });
  }, [laporan, user?.role]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Bell size={34} />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Notifikasi</h1>
              <p className="text-blue-100 mt-2">
                Pantau aktivitas terbaru pada sistem pengaduan masyarakat
              </p>
            </div>
          </div>
        </div>

        {user?.role === "super_admin" && (
          <div className="bg-white rounded-3xl shadow p-5 md:p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 text-purple-700 p-4 rounded-2xl">
                <UserPlus size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Informasi Super Admin
                </h2>
                <p className="text-gray-500 mt-1">
                  Kamu dapat mengelola akun user dan admin melalui halaman
                  Kelola User.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow p-5 md:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Daftar Notifikasi
          </h2>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada notifikasi</p>
            </div>
          ) : (
            <>
              <div className="md:hidden space-y-4">
                {notifications.map((item) => (
                  <MobileNotificationCard
                    key={item.id}
                    item={item}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              <div className="hidden md:block space-y-4">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-2xl p-5 hover:bg-blue-50 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${item.color} p-3 rounded-2xl`}>
                        {item.icon}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800">
                          {item.title}
                        </h3>

                        <p className="text-gray-500 mt-1">{item.message}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400">
                      {formatDate(item.date)}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}