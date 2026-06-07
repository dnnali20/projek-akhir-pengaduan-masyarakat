import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import toast, { Toaster } from "react-hot-toast";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  const addCategory = async (e) => {
    e.preventDefault();

    try {
      await API.post("/categories", { name });
      setName("");
      getCategories();
     toast.success("Kategori berhasil ditambahkan");
    } catch (err) {
     toast.error(err.response?.data?.message || "Gagal tambah kategori");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Yakin hapus kategori ini?")) return;

    try {
      await API.delete(`/categories/${id}`);
      getCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus kategori");
    }
  };

  if (user?.role === "user") {
    return (
      <Layout>
        <Toaster position="top-right" />
        <div className="bg-white rounded-3xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
          <p className="text-gray-500 mt-2">
            Halaman ini hanya untuk admin dan super admin.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Tambah Kategori
          </h1>

          <form onSubmit={addCategory} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Nama kategori"
              className="w-full border rounded-xl px-4 py-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
              Tambah
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Data Kategori
          </h1>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center border rounded-2xl p-4"
              >
                <p className="font-semibold text-gray-800">{cat.name}</p>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-gray-500 text-center">Belum ada kategori</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}