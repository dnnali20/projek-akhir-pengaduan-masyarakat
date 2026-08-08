import { useEffect, useState } from "react";
import {
  Mail,
  Shield,
  User,
  CalendarDays,
  BadgeCheck,
  IdCard,
  Phone,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  X,
  Camera,
  MessageCircle,
  ClipboardList,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../components/Layout";
import API from "../api/api";
import MobileProfileHeader from "../mobile/MobileProfileHeader";
import MobileProfileInfo from "../mobile/MobileProfileInfo";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [laporan, setLaporan] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    birth_date: "",
    gender: "",
    phone: "",
    address: "",
    bio: "",
    profile_photo: null,
  });

  useEffect(() => {
    getProfile();
    getRiwayat();
  }, []);

  const getProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));

      setForm({
        name: res.data.name || "",
        birth_date: res.data.birth_date ? res.data.birth_date.slice(0, 10) : "",
        gender: res.data.gender || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        bio: res.data.bio || "",
        profile_photo: null,
      });
    } catch {
      toast.error("Gagal mengambil profile");
    }
  };

  const getRiwayat = async () => {
    try {
      const res = await API.get("/laporan/my");
      setLaporan(res.data);
    } catch {
      setLaporan([]);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("birth_date", form.birth_date);
    data.append("gender", form.gender);
    data.append("phone", form.phone);
    data.append("address", form.address);
    data.append("bio", form.bio);

    if (form.profile_photo) {
      data.append("profile_photo", form.profile_photo);
    }

    try {
      const res = await API.put("/auth/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setShowEdit(false);
      toast.success("Profile berhasil diupdate");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal update profile");
    }
  };

  const roleLabel =
    user?.role === "super_admin"
      ? "Super Admin"
      : user?.role === "admin"
      ? "Admin"
      : "User";

  const theme =
    user?.role === "super_admin"
      ? {
          gradient: "from-purple-800 to-fuchsia-600",
          soft: "bg-fuchsia-50",
          text: "text-fuchsia-700",
          lightText: "text-fuchsia-100",
          iconBg: "bg-fuchsia-100",
        }
      : user?.role === "admin"
      ? {
          gradient: "from-emerald-700 to-green-500",
          soft: "bg-green-50",
          text: "text-green-700",
          lightText: "text-green-100",
          iconBg: "bg-green-100",
        }
      : {
          gradient: "from-blue-800 to-blue-500",
          soft: "bg-blue-50",
          text: "text-blue-700",
          lightText: "text-blue-100",
          iconBg: "bg-blue-100",
        };

  const total = laporan.length;
  const pending = laporan.filter((item) => item.status === "pending").length;
  const approved = laporan.filter((item) => item.status === "approved").length;
  const rejected = laporan.filter((item) => item.status === "rejected").length;

  const successRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

  const level =
    approved >= 50
      ? "Legenda"
      : approved >= 20
      ? "Warga Peduli"
      : approved >= 10
      ? "Kontributor"
      : approved >= 5
      ? "Pelapor Aktif"
      : "Pemula";

  const photoUrl = user?.profile_photo
    ? `${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${user.profile_photo}`
    : null;

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto space-y-6">
        <MobileProfileHeader
          user={user}
          roleLabel={roleLabel}
          photoUrl={photoUrl}
          onEdit={() => setShowEdit(true)}
        />

        <MobileProfileInfo
          user={user}
          roleLabel={roleLabel}
          formatDate={formatDate}
        />

        <div
          className={`hidden md:block bg-gradient-to-r ${theme.gradient} rounded-3xl p-8 text-white shadow-lg`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white text-blue-700 flex items-center justify-center text-5xl font-bold shadow-lg overflow-hidden">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <p className={theme.lightText}>
                {user?.role === "super_admin"
                  ? "Super Administrator"
                  : user?.role === "admin"
                  ? "Administrator Sistem"
                  : "Pengguna Sistem"}
              </p>

              <h1 className="text-4xl font-bold mt-1">{user?.name}</h1>
              <p className={`${theme.lightText} mt-2`}>{user?.email}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <BadgeCheck size={18} />
                  <span className="font-semibold">{roleLabel}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                  <Star size={18} />
                  {level}
                </div>

                <button
                  onClick={() => setShowEdit(true)}
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-full font-bold hover:bg-blue-50"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {showEdit && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h2>
                  <p className="text-gray-500">
                    Perbarui data pribadi akun kamu
                  </p>
                </div>

                <button
                  onClick={() => setShowEdit(false)}
                  className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={updateProfile} className="space-y-5">
                <div>
                  <label className="font-semibold text-gray-700 flex items-center gap-2">
                    <Camera size={18} />
                    Foto Profile
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full mt-2 border rounded-xl px-4 py-3"
                    onChange={(e) =>
                      setForm({ ...form, profile_photo: e.target.files[0] })
                    }
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-semibold text-gray-700">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                      value={form.birth_date}
                      onChange={(e) =>
                        setForm({ ...form, birth_date: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      Jenis Kelamin
                    </label>
                    <select
                      className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">No HP</label>
                  <input
                    type="text"
                    className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Alamat</label>
                  <textarea
                    rows="3"
                    className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  ></textarea>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Bio</label>
                  <textarea
                    rows="3"
                    className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
                    Simpan Perubahan
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-5">
          <StatCard title="Total Laporan" value={total} icon={<FileText />} />
          <StatCard title="Pending" value={pending} icon={<Clock />} />
          <StatCard title="Approved" value={approved} icon={<CheckCircle />} />
          <StatCard title="Rejected" value={rejected} icon={<XCircle />} />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 p-3 rounded-2xl">
                <TrendingUp />
              </div>
              <div>
                <h2 className="font-bold text-green-700 text-xl">
                  Tingkat Keberhasilan
                </h2>
                <p className="text-green-600 text-sm">
                  Persentase laporan yang disetujui
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-bold mt-5 text-green-700">
              {successRate}%
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">
                Progress Level
              </span>
              <span className="font-bold text-orange-600">{approved}/50</span>
            </div>

            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                style={{
                  width: `${Math.min((approved / 50) * 100, 100)}%`,
                }}
              />
            </div>

            <p className="text-gray-500 mt-4">
              Level saat ini:{" "}
              <span className="font-bold text-orange-600">{level}</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <Trophy />
            <h2 className="text-2xl font-bold">Achievement</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <AchievementCard
              title="Pelapor Aktif"
              value={total >= 5 ? "Unlocked" : "Locked"}
            />
            <AchievementCard
              title="Kontributor"
              value={approved >= 10 ? "Unlocked" : "Locked"}
            />
            <AchievementCard
              title="Warga Peduli"
              value={approved >= 20 ? "Unlocked" : "Locked"}
            />
            <AchievementCard
              title="Top Reporter"
              value={approved >= 50 ? "Unlocked" : "Locked"}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="hidden md:block lg:col-span-2 bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`${theme.iconBg} ${theme.text} p-3 rounded-2xl`}>
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Informasi Data Pribadi
                </h2>
                <p className="text-gray-500">
                  Ringkasan data akun pada sistem pengaduan masyarakat
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <InfoBox label="Nama Lengkap" value={user?.name} />
              <InfoBox label="Email" value={user?.email} />
              <InfoBox label="Jenis Kelamin" value={user?.gender || "-"} />
              <InfoBox
                label="Tanggal Lahir"
                value={user?.birth_date ? formatDate(user.birth_date) : "-"}
              />
              <InfoBox label="No HP" value={user?.phone || "-"} />
              <InfoBox label="Role" value={roleLabel} />
              <InfoBox label="Alamat" value={user?.address || "-"} large />
              <InfoBox label="Bio" value={user?.bio || "-"} large />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detail Akun
              </h2>

              <div className="space-y-4">
                <ProfileRow icon={<IdCard />} label="ID User" value={user?.id} />
                <ProfileRow icon={<Mail />} label="Email" value={user?.email} />
                <ProfileRow
                  icon={<Shield />}
                  label="Hak Akses"
                  value={roleLabel}
                />
                <ProfileRow
                  icon={<CalendarDays />}
                  label="Tanggal Lahir"
                  value={user?.birth_date ? formatDate(user.birth_date) : "-"}
                />
                <ProfileRow
                  icon={<CalendarDays />}
                  label="Bergabung Sejak"
                  value={user?.created_at ? formatDate(user.created_at) : "-"}
                />
                <ProfileRow
                  icon={<Phone />}
                  label="No HP"
                  value={user?.phone || "-"}
                />
                <ProfileRow
                  icon={<MapPin />}
                  label="Alamat"
                  value={user?.address || "-"}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Peran Dalam Sistem
              </h2>

              <div className={`${theme.soft} rounded-2xl p-5`}>
                <h3 className={`font-bold ${theme.text} text-lg`}>
                  {user?.role === "super_admin"
                    ? "Super Administrator"
                    : user?.role === "admin"
                    ? "Admin Pengelola"
                    : "User Masyarakat"}
                </h3>

                <p className="text-gray-600 mt-2 leading-relaxed">
                  {user?.role === "super_admin" &&
                    "Bertugas mengelola akun user dan admin, menjaga struktur pengguna, serta memastikan sistem berjalan sesuai kebutuhan."}
                  {user?.role === "admin" &&
                    "Bertugas meninjau laporan masyarakat, melakukan verifikasi, dan mengubah status laporan menjadi approved atau rejected."}
                  {user?.role === "user" &&
                    "Dapat membuat laporan pengaduan, melihat laporan publik, memantau riwayat pribadi, mengedit profil, dan memberi komentar."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {user?.role === "user" && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
                <ClipboardList size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Riwayat Laporan Saya
                </h2>
                <p className="text-gray-500">
                  Daftar laporan yang pernah kamu kirim ke sistem
                </p>
              </div>
            </div>

            {laporan.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada riwayat laporan
              </p>
            ) : (
              <div className="space-y-4">
                {laporan.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:bg-blue-50 transition"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {item.title}
                      </h3>
                      <p className="text-sm text-blue-700 font-semibold mt-1">
                        {item.category_name}
                      </p>
                      <p className="text-gray-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${statusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`${theme.iconBg} ${theme.text} p-3 rounded-2xl`}>
                <MessageCircle size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Aktivitas Sistem
                </h2>
                <p className="text-gray-500">
                  Ringkasan peran dan aktivitas pengelolaan dalam sistem
                </p>
              </div>
            </div>

            <div className={`${theme.soft} rounded-2xl p-6`}>
              <p className="text-gray-700 leading-relaxed">
                {user?.role === "admin"
                  ? "Admin berfokus pada proses validasi laporan masyarakat. Gunakan dashboard untuk memantau laporan masuk dan memperbarui status laporan sesuai hasil pengecekan."
                  : "Super admin berfokus pada pengelolaan akun dan struktur pengguna. Gunakan halaman Kelola User untuk menambah, mengubah, atau mengatur role pengguna."}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow p-5 flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold text-blue-700 mt-2">{value}</h2>
      </div>

      <div className="bg-blue-100 text-blue-700 p-4 rounded-2xl">{icon}</div>
    </div>
  );
}

function AchievementCard({ title, value }) {
  return (
    <div className="bg-white/20 rounded-2xl p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2">{value}</p>
    </div>
  );
}

function InfoBox({ label, value, large }) {
  return (
    <div className={`bg-gray-50 rounded-2xl p-5 ${large ? "md:col-span-2" : ""}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="font-bold text-gray-800 mt-1 break-words">
        {value || "-"}
      </h3>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 border rounded-2xl p-4">
      <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">{icon}</div>

      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="font-bold text-gray-800 break-words">{value}</h3>
      </div>
    </div>
  );
}

function statusClass(status) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}