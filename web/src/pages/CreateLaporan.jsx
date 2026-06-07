import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import MobileCreateLaporanForm from "../mobile/MobileCreateLaporanForm";

export default function CreateLaporan() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    image: null,
    location_address: "",
  });

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Gagal mengambil kategori");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("category_id", form.category_id);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("location_address", form.location_address);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      await API.post("/laporan", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Laporan berhasil dibuat");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat laporan");
    }
  };

  if (user?.role !== "user") {
    return (
      <Layout>
        <Toaster position="top-right" />

        <div className="bg-white rounded-3xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>

          <p className="text-gray-500 mt-2">
            Hanya user yang boleh membuat laporan.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />

      <MobileCreateLaporanForm
        form={form}
        setForm={setForm}
        categories={categories}
        handleSubmit={handleSubmit}
      />

      <div className="hidden md:block max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800">Tambah Laporan</h1>

          <p className="text-gray-500 mt-2">
            Isi data pengaduan dengan jelas dan lengkap
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="font-semibold text-gray-700">Kategori</label>

              <select
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                value={form.category_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category_id: e.target.value,
                  })
                }
              >
                <option value="">Pilih kategori</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Judul Laporan
              </label>

              <input
                type="text"
                placeholder="Contoh: Jalan rusak di depan sekolah"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Deskripsi</label>

              <textarea
                rows="5"
                placeholder="Jelaskan detail pengaduan..."
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <label className="font-semibold text-gray-700">
                    Lokasi Laporan
                  </label>

                  <p className="text-sm text-gray-500 mt-1">
                    Isi nama jalan, alamat, atau patokan lokasi laporan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      "https://www.google.com/maps/",
                      "_blank",
                      "noopener,noreferrer"
                    );

                    toast.success(
                      "Buka Google Maps, lalu salin nama jalan atau patokan lokasi."
                    );
                  }}
                  className="bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-800"
                >
                  Buka Google Maps
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-700">
                  Address
                </label>

                <input
                  type="text"
                  placeholder="Contoh: Jl. Margonda Raya dekat halte..."
                  className="w-full mt-2 border rounded-xl px-4 py-3 outline-blue-500"
                  value={form.location_address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location_address: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Upload Gambar
              </label>

              <input
                type="file"
                accept="image/*"
                className="w-full mt-2 border rounded-xl px-4 py-3"
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.files[0],
                  })
                }
              />
            </div>

            {form.image && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-2">
                  Preview Gambar
                </p>

                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="w-full max-h-80 object-cover rounded-2xl border"
                />
              </div>
            )}

            <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
              Kirim Laporan
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}