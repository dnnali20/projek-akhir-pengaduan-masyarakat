import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Layout from "../components/Layout";
import API from "../api/api";


export default function Statistik() {
  const [laporan, setLaporan] = useState([]);

  useEffect(() => {
    getLaporan();
  }, []);

  const getLaporan = async () => {
    try {
      const res = await API.get("/laporan");
      setLaporan(res.data);
    } catch {
      console.log("Gagal mengambil statistik");
    }
  };

  const total = laporan.length;
  const pending = laporan.filter((item) => item.status === "pending").length;
  const approved = laporan.filter((item) => item.status === "approved").length;
  const rejected = laporan.filter((item) => item.status === "rejected").length;

  const statusData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  const categoryStats = {};

  laporan.forEach((item) => {
    if (!item.category_name) return;
    categoryStats[item.category_name] =
      (categoryStats[item.category_name] || 0) + 1;
  });

  const categoryData = Object.keys(categoryStats).map((key) => ({
    name: key,
    total: categoryStats[key],
  }));

  const COLORS = ["#eab308", "#16a34a", "#dc2626", "#2563eb", "#9333ea"];

  const totalUser = JSON.parse(localStorage.getItem("totalUser")) || 0;
  const totalAdmin = JSON.parse(localStorage.getItem("totalAdmin")) || 0;

  const latestApproved = laporan.filter(
    (item) => item.status === "approved"
  ).length;

  const successRate =
    total > 0
      ? ((approved / total) * 100).toFixed(1)
      : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-3xl p-8 text-white shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <BarChart3 size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">Statistik Laporan</h1>
              <p className="text-blue-100 mt-2">
                Analisis data pengaduan masyarakat berdasarkan status dan kategori
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
          <StatCard title="Total Laporan" value={total} icon={<FileText />} />
          <StatCard title="Pending" value={pending} icon={<Clock />} />
          <StatCard title="Approved" value={approved} icon={<CheckCircle />} />
          <StatCard title="Rejected" value={rejected} icon={<XCircle />} />
          <StatCard title="Total User" value={totalUser} icon={<Users />} />
          <StatCard title="Total Admin" value={totalAdmin} icon={<ShieldCheck />} />
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 text-white shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-90">
                Tingkat Penyelesaian Laporan
              </p>

              <h2 className="text-5xl font-bold mt-2">
                {successRate}%
              </h2>
            </div>

            <TrendingUp size={60} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Status Laporan
            </h2>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    dataKey="value"
                    label
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Statistik Kategori
            </h2>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[12, 12, 0, 0]}>
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Aktivitas Laporan Terbaru
          </h2>

          <div className="space-y-4">
            {laporan.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border rounded-2xl p-4 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.category_name} • oleh {item.user_name}
                  </p>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
            ))}

            {laporan.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Belum ada data laporan
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-4xl font-bold text-gray-800 mt-2">{value}</h2>
      </div>

      <div className="bg-blue-100 text-blue-700 p-4 rounded-2xl">{icon}</div>
    </div>
  );
}

function statusClass(status) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}