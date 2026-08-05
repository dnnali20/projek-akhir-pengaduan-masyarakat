import { ImagePlus, MapPin, Send } from "lucide-react";

export default function MobileCreateLaporanForm({
  form,
  setForm,
  categories,
  handleSubmit,
}) {
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung lokasi");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm({
          ...form,
          location_address: `Lat: ${latitude}, Lng: ${longitude}`,
        });
      },
      () => {
        alert("Gagal mengambil lokasi");
      }
    );
  };

  return (
    <div className="md:hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-3xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Tambah Laporan</h1>
        <p className="text-blue-100 text-sm mt-2">
          Isi pengaduan dengan jelas agar mudah ditindaklanjuti.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-3xl shadow p-5 space-y-5">
          <div>
            <label className="font-semibold text-slate-700">Kategori</label>
            <select
              className="w-full mt-2 border rounded-2xl px-4 py-4 outline-blue-500"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
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
            <label className="font-semibold text-slate-700">
              Judul Laporan
            </label>
            <input
              type="text"
              placeholder="Contoh: Jalan rusak"
              className="w-full mt-2 border rounded-2xl px-4 py-4 outline-blue-500"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Deskripsi</label>
            <textarea
              rows="5"
              placeholder="Jelaskan detail pengaduan..."
              className="w-full mt-2 border rounded-2xl px-4 py-4 outline-blue-500"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-5 space-y-4">
          <label className="font-semibold text-slate-700 flex items-center gap-2">
            <ImagePlus size={18} />
            Upload Gambar
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-2xl px-4 py-4"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />

          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-2xl border"
            />
          )}
        </div>

        <div className="bg-white rounded-3xl shadow p-5 space-y-4">
          <label className="font-semibold text-slate-700 flex items-center gap-2">
            <MapPin size={18} />
            Lokasi Laporan
          </label>

          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full bg-blue-100 text-blue-700 py-4 rounded-2xl font-bold"
          >
            Ambil Lokasi Saya
          </button>

          <input
            type="text"
            placeholder="Alamat / keterangan lokasi"
            className="w-full border rounded-2xl px-4 py-4 outline-blue-500"
            value={form.location_address}
            onChange={(e) =>
              setForm({ ...form, location_address: e.target.value })
            }
          />

          {form.location_address && (
            <p className="text-sm text-slate-500">
              Lokasi: {form.location_address}
            </p>
          )}
        </div>

        <button className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
          <Send size={20} />
          Kirim Laporan
        </button>
      </form>
    </div>
  );
}