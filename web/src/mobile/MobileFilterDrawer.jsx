import { X, Search, Filter } from "lucide-react";

export default function MobileFilterDrawer({
  open,
  onClose,
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  categories,
}) {
  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-black/50 z-[60] flex items-end">
      <div className="bg-white w-full rounded-t-[2rem] p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
              <Filter size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Filter Laporan
              </h2>
              <p className="text-sm text-slate-500">
                Cari dan saring data laporan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-100 p-3 rounded-2xl"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari laporan..."
              className="w-full border bg-white text-slate-800 rounded-2xl pl-12 pr-4 py-4 outline-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="w-full border bg-white text-slate-800 rounded-2xl px-4 py-4 outline-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="w-full border bg-white text-slate-800 rounded-2xl px-4 py-4 outline-blue-500"
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

          <button
            onClick={onClose}
            className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}