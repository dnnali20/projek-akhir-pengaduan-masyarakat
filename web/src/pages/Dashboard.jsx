import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  UserPlus,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../components/Layout";
import API, { API_URL } from "../api/api";
import useLaporanRealtime from "../hooks/useLaporanRealtime";
import MobileDashboardCard from "../mobile/MobileDashboardCard";
import MobileHeader from "../mobile/MobileHeader";
import MobileStatCard from "../mobile/MobileStatCard";
import MobileFilterDrawer from "../mobile/MobileFilterDrawer";
import API, { API_URL } from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [laporan, setLaporan] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  

  const user = JSON.parse(sessionStorage.getItem("user"));

  const getLaporan = async () => {
    try {
      const endpoint = user?.role === "user" ? "/laporan" : "/laporan";


      const res = await API.get(endpoint);
      setLaporan(res.data);
    } catch {
      toast.error("Gagal mengambil laporan");
    }
  };

  useEffect(() => {
    getLaporan();
  }, []);

  useLaporanRealtime({
    onLaporkanUpdated: () => {
      getLaporan();
    },
  });

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/laporan/${id}/status`, { status });
      toast.success("Status berhasil diupdate");
      getLaporan();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal update status");
    }
  };

  const filteredLaporan = useMemo(() => {
    return laporan.filter((item) => {
      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.user_name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus ? item.status === filterStatus : true;

      const matchCategory = filterCategory
        ? item.category_name === filterCategory
        : true;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [laporan, search, filterStatus, filterCategory]);

  const categories = [
    ...new Set(laporan.map((item) => item.category_name).filter(Boolean)),
  ];

  const total = laporan.length;
  const pending = laporan.filter((item) => item.status === "pending").length;
  const approved = laporan.filter((item) => item.status === "approved").length;
  const rejected = laporan.filter((item) => item.status === "rejected").length;

  return (
    <Layout>
      <Toaster position="top-right" />

      <MobileHeader
        title={user?.role === "user" ? "Laporan Publik" : "Kelola Laporan"}
        subtitle={
          user?.role === "user"
            ? "Pantau laporan masyarakat yang sudah disetujui."
            : "Pantau dan tindak lanjuti semua laporan masyarakat."
        }
      />

      <div className="hidden md:block bg-gradient-to-r from-blue-800 to-blue-500 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
          <div>
            <p className="text-blue-100">Halo, {user?.name}</p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              {user?.role === "user"
                ? "Dashboard Laporan Publik"
                : "Dashboard Pengelolaan Laporan"}
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              {user?.role === "user"
                ? "Pantau laporan masyarakat yang sudah disetujui dan buat pengaduan baru dengan mudah."
                : "Kelola semua laporan masyarakat, pantau status, dan tindak lanjuti pengaduan."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {user?.role === "user" && (
              <>
                <Link
                  to="/laporan/create"
                  className="bg-white text-blue-700 px-5 py-3 rounded-xl font-bold hover:bg-blue-50"
                >
                  + Tambah Laporan
                </Link>

                <Link
                  to="/riwayat"
                  className="bg-blue-900/40 border border-white/40 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-900/60"
                >
                  Riwayat Saya
                </Link>
              </>
            )}

            {user?.role === "super_admin" && (
              <Link
                to="/users"
                className="bg-white text-blue-700 px-5 py-3 rounded-xl font-bold hover:bg-blue-50 flex items-center gap-2"
              >
                <UserPlus size={18} />
                Kelola User
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
        <MobileStatCard
          title="Total Laporan"
          value={total}
          icon={<FileText size={22} />}
          bg="bg-blue-100"
          text="text-blue-700"
        />

        <MobileStatCard
          title="Pending"
          value={pending}
          icon={<Clock size={22} />}
          bg="bg-yellow-100"
          text="text-yellow-700"
        />

        <MobileStatCard
          title="Approved"
          value={approved}
          icon={<CheckCircle size={22} />}
          bg="bg-green-100"
          text="text-green-700"
        />

        <MobileStatCard
          title="Rejected"
          value={rejected}
          icon={<XCircle size={22} />}
          bg="bg-red-100"
          text="text-red-700"
        />
      </div>

      <div className="hidden md:grid md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Laporan"
          value={total}
          icon={<FileText size={26} />}
          bg="bg-blue-100"
          text="text-blue-700"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock size={26} />}
          bg="bg-yellow-100"
          text="text-yellow-700"
        />

        <StatCard
          title="Approved"
          value={approved}
          icon={<CheckCircle size={26} />}
          bg="bg-green-100"
          text="text-green-700"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon={<XCircle size={26} />}
          bg="bg-red-100"
          text="text-red-700"
        />
      </div>

      <div className="md:hidden mb-5">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="w-full bg-white shadow border rounded-3xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
              <Filter size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">Filter Laporan</h3>
              <p className="text-sm text-slate-500">Cari status dan kategori</p>
            </div>
          </div>
          <span className="text-blue-700 font-bold">Buka</span>
        </button>
      </div>

      <div className="hidden md:block bg-white rounded-3xl shadow p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-blue-700" size={22} />
          <h2 className="text-xl font-bold text-gray-800">Filter Laporan</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari judul, deskripsi, atau pelapor..."
              className="w-full border bg-white text-gray-800 rounded-xl pl-12 pr-4 py-3 outline-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border bg-white text-gray-800 rounded-xl px-4 py-3 outline-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="border bg-white text-gray-800 rounded-xl px-4 py-3 outline-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar Laporan</h2>

          <p className="text-gray-500">
            Menampilkan {filteredLaporan.length} laporan
          </p>
        </div>
      </div>

      {filteredLaporan.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow">
          <p className="text-gray-500">Laporan tidak ditemukan</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-5">
            {filteredLaporan.map((item) => (
              <MobileDashboardCard
                key={item.id}
                item={item}
                user={user}
                updateStatus={updateStatus}
              />
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLaporan.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100"
              >
                {item.image ? (
                  
                  <img
                    src={`${API_URL}/uploads/${item.image}`}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="h-52 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Tidak ada gambar</p>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between gap-3 items-start">
                    <h2 className="text-xl font-bold text-gray-800">
                      {item.title}
                    </h2>

                    <StatusBadge status={item.status} />
                  </div>

                  <p className="text-sm text-blue-700 font-semibold mt-2">
                    {item.category_name}
                  </p>

                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-5 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400">Pelapor</p>

                      <p className="font-semibold text-gray-700">
                        {item.user_name}
                      </p>
                    </div>

                    <Link
                      to={`/laporan/${item.id}`}
                      className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-800 flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Detail
                    </Link>
                  </div>

                  {(user?.role === "admin" ||
                    user?.role === "super_admin") && (
                      <div className="flex gap-2 mt-5 pt-5 border-t">
                        <button
                          onClick={() => updateStatus(item.id, "approved")}
                          className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(item.id, "rejected")}
                          className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <MobileFilterDrawer
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />
    </Layout>
  );
}

function StatCard({ title, value, icon, bg, text }) {
  return (
    <div className="bg-white rounded-3xl shadow p-4 md:p-5 flex justify-between items-center border border-gray-100">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
          {value}
        </h2>
      </div>

      <div className={`${bg} ${text} p-3 md:p-4 rounded-2xl`}>{icon}</div>
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