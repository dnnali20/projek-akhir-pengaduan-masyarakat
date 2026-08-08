import { CalendarDays, MapPin, Shield, User } from "lucide-react";

export default function MobileDetailHeader({ laporan, formatDate }) {
  return (
    <div className="md:hidden space-y-4 mb-6">
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        {laporan?.image ? (
          <img
            src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${laporan.image}`}
            alt={laporan.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
            <p className="text-slate-400">Tidak ada gambar</p>
          </div>
        )}

        <div className="p-5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(laporan.status)}`}>
            {laporan.status}
          </span>

          <h1 className="text-2xl font-bold text-slate-800 mt-4">
            {laporan.title}
          </h1>

          <p className="text-blue-700 font-semibold mt-2">
            {laporan.category_name}
          </p>

          <p className="text-slate-500 mt-4 leading-relaxed whitespace-pre-line">
            {laporan.description}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5 space-y-3">
        <InfoItem icon={<User />} label="Pelapor" value={laporan.user_name} />
        <InfoItem
          icon={<CalendarDays />}
          label="Tanggal"
          value={formatDate(laporan.created_at)}
        />
        <InfoItem icon={<Shield />} label="Status" value={laporan.status} />

        {laporan.location_address && (
          <InfoItem
            icon={<MapPin />}
            label="Lokasi"
            value={laporan.location_address}
          />
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4">
      <div className="bg-blue-100 text-blue-700 p-2 rounded-xl shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <h3 className="font-bold text-slate-800 break-words">
          {value || "-"}
        </h3>
      </div>
    </div>
  );
}

function statusClass(status) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}