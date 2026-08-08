import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  CalendarDays,
  CheckCircle,
  Shield,
  Image as ImageIcon,
  MessageCircle,
  ClipboardList,
} from "lucide-react";

import Layout from "../components/Layout";
import API, { API_URL } from "../api/api";
import useCommentsRealtime from "../hooks/useCommentsRealtime";
import { exportLaporanPdf } from "../utils/exportLaporanPdf";
import MobileDetailHeader from "../mobile/MobileDetailHeader";


export default function DetailLaporan() {
  const { id } = useParams();

  const [laporan, setLaporan] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [form, setForm] = useState({
    status: "",
    admin_note: "",
    process_note: "",
    proof_image: null,
  });

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    getDetail();
    getComments();
  }, []);

  useCommentsRealtime({
    onCommentsUpdated: () => {
      getComments();
      getDetail();
    },
  });

  const getDetail = async () => {
    try {
      const res = await API.get(`/laporan/${id}`);

      setLaporan(res.data);

      setForm({
        status: res.data.status || "",
        admin_note: res.data.admin_note || "",
        process_note: res.data.process_note || "",
        proof_image: null,
      });
    } catch {
      toast.error("Gagal mengambil detail laporan");
    }
  };

  const getComments = async () => {
    try {
      const res = await API.get(`/comments/laporan/${id}`);
      setComments(res.data);
    } catch {
      toast.error("Gagal mengambil komentar");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return toast.error("Komentar tidak boleh kosong");
    }

    try {
      await API.post(`/comments/laporan/${id}`, { comment });
      toast.success("Komentar berhasil ditambahkan");
      setComment("");
      getComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambahkan komentar");
    }
  };

  const updateTindakLanjut = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("status", form.status);
    data.append("admin_note", form.admin_note);
    data.append("process_note", form.process_note);

    if (form.proof_image) {
      data.append("proof_image", form.proof_image);
    }

    try {
      await API.put(`/laporan/${id}/tindak-lanjut`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Tindak lanjut berhasil diperbarui");
      getDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal update tindak lanjut");
    }
  };

  if (!laporan) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto space-y-6">
        <MobileDetailHeader
          laporan={laporan}
          formatDate={formatDate}
        />
        <div className="flex justify-end mb-4">
          <button
            onClick={() => exportLaporanPdf({ laporan })}
            className="bg-green-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-800"
            disabled={!laporan}
            title="Export PDF laporan"
          >
            Export PDF
          </button>
        </div>
        <div className="hidden md:block bg-white rounded-3xl shadow overflow-hidden">
          {laporan.image ? (
            <img
               src={`${API_URL}/uploads/${item.image}`}
              alt={laporan.title}
              className="w-full h-[400px] object-cover"
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Tidak ada gambar</p>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  {laporan.title}
                </h1>

                <p className="text-blue-700 font-semibold mt-3">
                  {laporan.category_name}
                </p>
              </div>

              <StatusBadge status={laporan.status} />
            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-8">
              <InfoCard icon={<User />} label="Pelapor" value={laporan.user_name} />
              <InfoCard
                icon={<CalendarDays />}
                label="Tanggal"
                value={formatDate(laporan.created_at)}
              />
              <InfoCard icon={<Shield />} label="Status" value={laporan.status} />
            </div>

            {laporan.latitude && laporan.longitude && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800">Lokasi Laporan</h2>
                <p className="text-gray-500 mt-2">
                  Ditandai di Google Maps menggunakan koordinat.
                </p>

                <div className="mt-4 overflow-hidden rounded-3xl border bg-gray-50">
                  <iframe
                    title="Lokasi Laporan"
                    className="w-full h-[360px]"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      laporan.latitude
                    )},${encodeURIComponent(laporan.longitude)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    className="text-blue-700 font-semibold hover:underline"
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      laporan.latitude
                    )},${encodeURIComponent(laporan.longitude)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka di Google Maps ↗
                  </a>
                </div>
              </div>
            )}

            {!laporan.latitude && !laporan.longitude && laporan.location_address && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800">Lokasi Laporan</h2>
                <p className="text-gray-500 mt-2">{laporan.location_address}</p>

                <div className="mt-4 overflow-hidden rounded-3xl border bg-gray-50">
                  <iframe
                    title="Lokasi Laporan"
                    className="w-full h-[360px]"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      laporan.location_address
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    className="text-blue-700 font-semibold hover:underline"
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      laporan.location_address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka di Google Maps ↗
                  </a>
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800">
                Deskripsi Laporan
              </h2>

              <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
                {laporan.description}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
              <ClipboardList size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Timeline Laporan
              </h2>
              <p className="text-gray-500">
                Progres penanganan laporan masyarakat
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <TimelineItem
              color="bg-blue-600"
              title="Laporan Dibuat"
              desc="Laporan berhasil dikirim oleh masyarakat dan masuk ke sistem."
              date={laporan.created_at}
            />

            {laporan.process_note && (
              <TimelineItem
                color="bg-yellow-500"
                title="Laporan Diproses"
                desc={laporan.process_note}
                date={laporan.process_at}
              />
            )}

            {laporan.admin_note && (
              <TimelineItem
                color={
                  laporan.status === "approved" ? "bg-green-600" : "bg-red-600"
                }
                title={
                  laporan.status === "approved"
                    ? "Laporan Disetujui / Selesai"
                    : "Laporan Ditolak"
                }
                desc={laporan.admin_note}
                date={laporan.resolved_at}
                last
              />
            )}

            {!laporan.process_note && !laporan.admin_note && (
              <TimelineItem
                color="bg-gray-400"
                title="Menunggu Peninjauan Admin"
                desc="Laporan sedang menunggu pengecekan dari admin."
                date={laporan.created_at}
                last
              />
            )}
          </div>
        </div>

        {laporan.admin_note && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
                <Shield size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tindak Lanjut Admin
                </h2>

                <p className="text-gray-500">
                  Informasi hasil peninjauan laporan
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {laporan.admin_note}
              </p>

              {laporan.resolved_at && (
                <p className="text-sm text-gray-500 mt-4">
                  Ditinjau pada {formatDate(laporan.resolved_at)}
                </p>
              )}
            </div>

            {laporan.proof_image && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-3">
                  Bukti Tindak Lanjut
                </h3>

                <img
                    src={`${API_URL}/uploads/${item.image}`}
                  alt="Bukti"
                  className="w-full max-h-[500px] object-cover rounded-2xl border"
                />
              </div>
            )}
          </div>
        )}

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 text-green-700 p-3 rounded-2xl">
                <CheckCircle size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tinjau Laporan
                </h2>

                <p className="text-gray-500">
                  Kelola status, proses, dan tindak lanjut laporan
                </p>
              </div>
            </div>

            <form onSubmit={updateTindakLanjut} className="space-y-5">
              <div>
                <label className="font-semibold text-gray-700">
                  Status Laporan
                </label>

                <select
                  className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Catatan Proses
                </label>

                <textarea
                  rows="4"
                  placeholder="Contoh: laporan sedang diproses petugas..."
                  className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                  value={form.process_note}
                  onChange={(e) =>
                    setForm({ ...form, process_note: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Catatan Tindak Lanjut
                </label>

                <textarea
                  rows="5"
                  placeholder="Tuliskan hasil peninjauan admin..."
                  className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                  value={form.admin_note}
                  onChange={(e) =>
                    setForm({ ...form, admin_note: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Upload Bukti Tindak Lanjut
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                  onChange={(e) =>
                    setForm({ ...form, proof_image: e.target.files[0] })
                  }
                />
              </div>

              <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
                Simpan Tindak Lanjut
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
              <MessageCircle size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Komentar & Diskusi
              </h2>

              <p className="text-gray-500">
                Diskusi masyarakat dan admin terkait laporan
              </p>
            </div>
          </div>

          <form onSubmit={addComment} className="mb-8">
            <textarea
              rows="4"
              placeholder="Tulis komentar..."
              className="w-full border rounded-2xl px-4 py-4 outline-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button className="mt-4 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800">
              Kirim Komentar
            </button>
          </form>

          {comments.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">Belum ada komentar</p>
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((item) => (
                <div key={item.id} className="border rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                      {item.user_name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800">
                        {item.user_name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${item.user_role === "super_admin"
                            ? "bg-purple-100 text-purple-700"
                            : item.user_role === "admin"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {item.user_role}
                        </span>

                        <span className="text-xs text-gray-400">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mt-5 whitespace-pre-line">
                    {item.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
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
    <span
      className={`px-5 py-3 rounded-2xl text-sm font-bold capitalize ${style}`}
    >
      {status}
    </span>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
      <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}

function TimelineItem({ color, title, desc, date, last }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className={`w-5 h-5 rounded-full ${color}`}></div>
        {!last && <div className="w-1 flex-1 bg-gray-200 mt-2"></div>}
      </div>

      <div className="pb-8">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        <p className="text-gray-600 mt-2 leading-relaxed">{desc}</p>

        {date && (
          <p className="text-sm text-gray-400 mt-3">{formatDate(date)}</p>
        )}
      </div>
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}