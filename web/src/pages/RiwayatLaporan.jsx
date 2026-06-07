import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  X,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import Layout from "../components/Layout";
import API from "../api/api";
import useLaporanRealtime from "../hooks/useLaporanRealtime";
import MobileRiwayatCard from "../mobile/MobileRiwayatCard";

export default function RiwayatLaporan() {
  const [laporan, setLaporan] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    getMyLaporan();
  }, []);

  useLaporanRealtime({
    onLaporkanUpdated: () => {
      getMyLaporan();
    },
  });


  const getMyLaporan = async () => {
    try {
      const res = await API.get("/laporan/my");
      setLaporan(res.data);
    } catch {
      toast.error("Gagal mengambil riwayat laporan");
    }
  };

  const deleteLaporan = async (id) => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;

    try {
      await API.delete(`/laporan/${id}`);
      toast.success("Laporan berhasil dihapus");
      getMyLaporan();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus laporan");
    }
  };

  const filteredLaporan = useMemo(() => {
    return laporan.filter((item) => {
      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus
        ? item.status === filterStatus
        : true;

      return matchSearch && matchStatus;
    });
  }, [laporan, search, filterStatus]);

  const total = laporan.length;

  const pending = laporan.filter(
    (item) => item.status === "pending"
  ).length;

  const approved = laporan.filter(
    (item) => item.status === "approved"
  ).length;

  const rejected = laporan.filter(
    (item) => item.status === "rejected"
  ).length;

  const chartData = [
    { name: "Pending", total: pending },
    { name: "Approved", total: approved },
    { name: "Rejected", total: rejected },
  ];

  const COLORS = [
    "#eab308",
    "#16a34a",
    "#dc2626",
  ];

  const statusClass = (status) => {
    if (status === "approved")
      return "bg-green-100 text-green-700";

    if (status === "rejected")
      return "bg-red-100 text-red-700";

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Riwayat Laporan
          </h1>

          <p className="text-gray-500 mt-2">
            Daftar laporan yang pernah kamu buat
          </p>
        </div>

        <button
          onClick={() => setShowStats(true)}
          className="bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-blue-800 flex items-center gap-2"
        >
          <BarChart3 size={20} />
          Lihat Statistik
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Laporan"
          value={total}
          icon={<FileText size={24} />}
          bg="bg-blue-100"
          text="text-blue-700"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock size={24} />}
          bg="bg-yellow-100"
          text="text-yellow-700"
        />

        <StatCard
          title="Approved"
          value={approved}
          icon={<CheckCircle size={24} />}
          bg="bg-green-100"
          text="text-green-700"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon={<XCircle size={24} />}
          bg="bg-red-100"
          text="text-red-700"
        />
      </div>

      <div className="bg-white rounded-3xl shadow p-5 mb-8 grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cari laporan saya..."
          className="border rounded-2xl px-4 py-3 outline-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-2xl px-4 py-3 outline-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredLaporan.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow">
          <p className="text-gray-500">Belum ada laporan</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-5">
            {filteredLaporan.map((item) => (
              <MobileRiwayatCard
                key={item.id}
                item={item}
                deleteLaporan={deleteLaporan}
              />
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLaporan.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {item.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="h-52 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Tidak ada gambar</p>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between gap-3 items-start">
                    <h2 className="text-xl font-bold text-gray-800">
                      {item.title}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-sm text-blue-700 font-semibold mt-2">
                    {item.category_name}
                  </p>

                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-5 flex justify-between items-center">
                    <Link
                      to={`/laporan/${item.id}`}
                      className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-800"
                    >
                      Detail
                    </Link>

                    <button
                      onClick={() => deleteLaporan(item.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showStats && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-8 relative max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowStats(false)}
              className="absolute top-5 right-5 bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200"
            >
              <X size={22} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Statistik Laporan Saya
              </h2>

              <p className="text-gray-500 mt-2">
                Analisis laporan yang pernah kamu buat
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Status Laporan
                </h3>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value: pending,
                          },
                          {
                            name: "Approved",
                            value: approved,
                          },
                          {
                            name: "Rejected",
                            value: rejected,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label
                      >
                        {COLORS.map((color, index) => (
                          <Cell
                            key={index}
                            fill={color}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Grafik Status
                </h3>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />

                      <Bar
                        dataKey="total"
                        radius={[12, 12, 0, 0]}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
  text,
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2 text-gray-800">
          {value}
        </h2>
      </div>

      <div className={`${bg} ${text} p-4 rounded-2xl`}>
        {icon}
      </div>
    </div>
  );
}