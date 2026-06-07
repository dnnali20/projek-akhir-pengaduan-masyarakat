import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import toast, { Toaster } from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengambil user");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users", form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      getUsers();
      toast.success("User berhasil ditambahkan");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal tambah user");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Yakin hapus user ini?")) return;

    try {
      await API.delete(`/users/${id}`);
      getUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus user");
    }
  };

  const userLogin = JSON.parse(sessionStorage.getItem("user"));

  if (userLogin?.role !== "super_admin") {
    return (
      <Layout>
        <Toaster position="top-right" />
        <div className="bg-white rounded-3xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Akses Ditolak
          </h1>
          <p className="text-gray-500 mt-2">
            Halaman ini hanya untuk super admin.
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
            Tambah User
          </h1>

          <form onSubmit={createUser} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Nama"
              className="w-full border rounded-xl px-4 py-3"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-xl px-4 py-3"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-3"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="w-full border rounded-xl px-4 py-3"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
              Tambah User
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Data User
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {item.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteUser(item.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      Belum ada user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}