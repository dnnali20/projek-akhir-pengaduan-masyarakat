import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  MessageCircle,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Clock,
  XCircle,
  Users,
  Bell,
  Activity,
  Sparkles,
  MapPin,
  Zap,
  Lock,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import API from "../api/api";

export default function LandingPage() {
  const [laporan, setLaporan] = useState([]);

  useEffect(() => {
    getPublicData();
  }, []);

  const getPublicData = async () => {
    try {
      const res = await API.get("/laporan");
      setLaporan(res.data);
    } catch {
      setLaporan([]);
    }
  };

  const total = laporan.length;
  const pending = laporan.filter((item) => item.status === "pending").length;
  const approved = laporan.filter((item) => item.status === "approved").length;
  const rejected = laporan.filter((item) => item.status === "rejected").length;

  const latestReports = laporan.slice(0, 3);

  const topCategories = useMemo(() => {
    const count = {};

    laporan.forEach((item) => {
      if (!item.category_name) return;

      count[item.category_name] = (count[item.category_name] || 0) + 1;
    });

    return Object.entries(count)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [laporan]);

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                Pengaduan Masyarakat
              </h1>
              <p className="text-xs text-slate-400">
                Sistem Pelaporan Digital
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-300">
            <a href="#data" className="hover:text-white">
              Data
            </a>
            <a href="#fitur" className="hover:text-white">
              Fitur
            </a>
            <a href="#alur" className="hover:text-white">
              Alur
            </a>
            <a href="#kategori" className="hover:text-white">
              Kategori
            </a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-white font-semibold hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hidden sm:block px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-blue-500 rounded-full blur-[130px] opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-cyan-400 rounded-full blur-[130px] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-6 py-14 md:py-24 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-blue-100 px-4 py-2 rounded-full font-bold mb-6">
              <Sparkles size={18} />
              Sistem Pengaduan Modern & Realtime
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Suarakan Masalah,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Pantau Solusinya.
              </span>
            </h1>

            <p className="text-slate-300 text-lg mt-6 leading-relaxed max-w-2xl">
              Platform pengaduan masyarakat untuk membuat laporan, memantau
              status, melihat tindak lanjut admin, berdiskusi, dan mendapatkan
              informasi secara realtime.
            </p>

            <div className="flex flex-col justify-center sm:flex-row gap-4 mt-8">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-7 py-4 rounded-2xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-xl shadow-blue-500/30"
              >
                Buat Laporan Sekarang
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/login"
                className="bg-white/10 border border-white/20 text-white px-7 py-4 rounded-2xl font-bold hover:bg-white/20"
              >
                Masuk ke Sistem
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-10">
              <MiniStat value={total} label="Total Laporan" />
              <MiniStat value={pending} label="Pending" />
              <MiniStat value={approved} label="Approved" />
              <MiniStat value={rejected} label="Rejected" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-8 -right-4 bg-white rounded-3xl shadow-2xl p-5 border z-10 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-3 rounded-2xl">
                  <CheckCircle />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Realtime Update</p>
                  <h3 className="font-bold text-gray-800">
                    Laporan Terpantau
                  </h3>
                </div>
              </div>
            </motion.div>

            <div className="relative bg-white rounded-[2rem] shadow-2xl p-6 border">
              <div className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-3xl p-6 text-white">
                <p className="text-blue-100">Data Realtime</p>

                <h2 className="text-3xl font-bold mt-2">
                  Ringkasan Laporan Publik
                </h2>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <HeroStat icon={<FileText />} title="Total" value={total} />
                  <HeroStat icon={<Clock />} title="Pending" value={pending} />
                  <HeroStat
                    icon={<CheckCircle />}
                    title="Approved"
                    value={approved}
                  />
                  <HeroStat
                    icon={<XCircle />}
                    title="Rejected"
                    value={rejected}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-blue-700" size={22} />

                  <h3 className="font-bold text-gray-800">
                    Laporan Terbaru
                  </h3>
                </div>

                <div className="space-y-4">
                  {latestReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      Belum ada laporan
                    </p>
                  ) : (
                    latestReports.map((item) => (
                      <ReportPreview
                        key={item.id}
                        title={item.title}
                        desc={item.description}
                        status={item.status}
                        category={item.category_name}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="data" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Data Pengaduan Publik
            </h2>

            <p className="text-gray-500 mt-4">
              Statistik ini diambil langsung dari data laporan yang tersimpan
              dalam sistem.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            <StatCard
              title="Total Laporan"
              value={total}
              icon={<FileText />}
              color="blue"
            />

            <StatCard
              title="Menunggu"
              value={pending}
              icon={<Clock />}
              color="yellow"
            />

            <StatCard
              title="Disetujui"
              value={approved}
              icon={<CheckCircle />}
              color="green"
            />

            <StatCard
              title="Ditolak"
              value={rejected}
              icon={<XCircle />}
              color="red"
            />
          </div>
        </div>
      </section>

      <section id="fitur" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold mb-5">
              <Zap size={18} />
              Fitur Sistem
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              Fitur Unggulan Sistem
            </h2>

            <p className="text-gray-500 mt-4">
              Dirancang untuk memudahkan proses pengaduan, validasi,
              komunikasi, dan pelaporan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileText />}
              title="Pelaporan Digital"
              desc="User dapat membuat laporan lengkap dengan kategori, deskripsi, gambar, dan riwayat status."
            />

            <FeatureCard
              icon={<ShieldCheck />}
              title="Tinjau Admin"
              desc="Admin dapat meninjau laporan, memberi catatan proses, status, dan bukti tindak lanjut."
            />

            <FeatureCard
              icon={<MessageCircle />}
              title="Komentar Diskusi"
              desc="User, admin, dan super admin dapat berdiskusi langsung pada detail laporan."
            />

            <FeatureCard
              icon={<Bell />}
              title="Notifikasi"
              desc="Pengguna dapat melihat informasi terbaru dari laporan yang dibuat atau dikelola."
            />

            <FeatureCard
              icon={<BarChart3 />}
              title="Statistik"
              desc="Admin dan super admin dapat melihat data laporan berdasarkan status dan kategori."
            />

            <FeatureCard
              icon={<Users />}
              title="Manajemen User"
              desc="Super admin dapat mengelola akun user, admin, dan hak akses sistem."
            />
          </div>
        </div>
      </section>

      <section id="alur" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold mb-5">
              <MapPin size={18} />
              Alur Pengaduan
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              Proses Laporan yang Transparan
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              Setiap laporan memiliki tahapan yang jelas mulai dari dibuat,
              ditinjau, diproses, hingga mendapatkan keputusan dari admin.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <WhyCard icon={<Zap />} title="Realtime" />
              <WhyCard icon={<Lock />} title="Aman" />
              <WhyCard icon={<BarChart3 />} title="Statistik" />
              <WhyCard icon={<Smartphone />} title="Responsive" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-blue-100"></div>

            <div className="space-y-6">
              <Step number="1" title="User Membuat Laporan" />
              <Step number="2" title="Laporan Masuk ke Dashboard Admin" />
              <Step number="3" title="Admin Meninjau dan Memberi Catatan" />
              <Step number="4" title="User Melihat Riwayat dan Tindak Lanjut" />
            </div>
          </div>
        </div>
      </section>

      <section id="kategori" className="bg-blue-950 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 px-4 py-2 rounded-full font-bold mb-5">
              <BarChart3 size={18} />
              Data Kategori
            </div>

            <h2 className="text-4xl font-bold text-white">
              Kategori Pengaduan Terbanyak
            </h2>

            <p className="text-blue-200 mt-4">
              Data ini dihitung otomatis dari laporan yang tersimpan di sistem.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl">
            {topCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada data kategori
              </p>
            ) : (
              <div className="space-y-5">
                {topCategories.map((cat, index) => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-2">
                      <p className="font-bold text-gray-800">
                        {index + 1}. {cat.name}
                      </p>

                      <p className="font-bold text-blue-700">
                        {cat.total} laporan
                      </p>
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-700 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (cat.total / Math.max(total, 1)) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-[2rem] p-10 md:p-14 text-white text-center shadow-2xl">
            <h2 className="text-4xl font-bold">
              Siap Membuat Pengaduan?
            </h2>

            <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
              Buat akun dan mulai laporkan masalah di lingkungan sekitar agar
              dapat dipantau dan ditindaklanjuti.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                to="/register"
                className="bg-white text-blue-700 px-7 py-4 rounded-2xl font-bold hover:bg-blue-50"
              >
                Daftar Sekarang
              </Link>

              <Link
                to="/login"
                className="bg-blue-900/40 border border-white/40 text-white px-7 py-4 rounded-2xl font-bold hover:bg-blue-900/60"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-3 rounded-2xl">
                <ShieldCheck size={24} />
              </div>

              <h3 className="font-bold text-lg">
                Pengaduan Masyarakat
              </h3>
            </div>

            <p className="text-slate-400 mt-4">
              Sistem pelaporan digital untuk memudahkan masyarakat menyampaikan
              pengaduan secara cepat dan transparan.
            </p>
          </div>

          <FooterGroup
            title="Menu"
            items={["Home", "Data Publik", "Fitur", "Alur"]}
          />

          <FooterGroup
            title="Fitur"
            items={["Laporan", "Komentar", "Statistik", "Notifikasi"]}
          />

          <FooterGroup
            title="Project"
            items={["React", "Express", "MySQL", "Socket.IO"]}
          />
        </div>
      </footer>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
      <h3 className="font-bold text-2xl text-white">{value}</h3>
      <p className="text-sm text-blue-100">{label}</p>
    </div>
  );
}

function HeroStat({ icon, title, value }) {
  return (
    <div className="bg-white/15 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-blue-100">
        {icon}
        <p className="text-sm">{title}</p>
      </div>

      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const styles = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl shadow p-6 flex justify-between items-center border"
    >
      <div>
        <p className="text-gray-500">{title}</p>

        <h3 className="text-4xl font-bold text-gray-900 mt-2">
          {value}
        </h3>
      </div>

      <div className={`${styles[color]} p-4 rounded-2xl`}>
        {icon}
      </div>
    </motion.div>
  );
}

function ReportPreview({ title, desc, status, category }) {
  const style =
    status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="border rounded-2xl p-4 hover:bg-blue-50 transition">
      <div className="flex justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-800 line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-blue-700 font-bold mt-1">
            {category || "Tanpa Kategori"}
          </p>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {desc}
          </p>
        </div>

        <span
          className={`${style} px-3 py-1 h-fit rounded-full text-xs font-bold`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-slate-50 rounded-3xl p-6 hover:shadow-lg transition border"
    >
      <div className="bg-blue-100 text-blue-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-800">{title}</h3>

      <p className="text-gray-500 mt-3 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function WhyCard({ icon, title }) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-3">
      <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
        {icon}
      </div>

      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
  );
}

function Step({ number, title }) {
  return (
    <div className="relative bg-white rounded-3xl p-6 shadow border flex items-center gap-5 z-10">
      <div className="bg-blue-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold">
        {number}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      </div>

      <ChevronRight className="text-gray-300" />
    </div>
  );
}

function FooterGroup({ title, items }) {
  return (
    <div>
      <h3 className="font-bold mb-4">{title}</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <p key={item} className="text-slate-400">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}