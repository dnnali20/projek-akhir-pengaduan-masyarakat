import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      toast.success("Register berhasil, silakan login");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-400 px-4">
      <Toaster position="top-right" />
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Buat Akun
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Daftar untuk membuat laporan
        </p>


        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full border rounded-xl px-4 py-3 outline-blue-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3 outline-blue-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3 outline-blue-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-700 font-semibold">
            Login
          </Link>
        </p>


      </div>
    </div>
  );
}