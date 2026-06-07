import {
  User,
  Mail,
  Shield,
  CalendarDays,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

export default function MobileProfileInfo({ user, roleLabel, formatDate }) {
  return (
    <div className="md:hidden space-y-4">
      <div className="bg-white rounded-3xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Data Pribadi
        </h2>

        <div className="space-y-3">
          <InfoItem icon={<User />} label="Nama" value={user?.name} />
          <InfoItem icon={<Mail />} label="Email" value={user?.email} />
          <InfoItem icon={<Shield />} label="Role" value={roleLabel} />
          <InfoItem
            icon={<CalendarDays />}
            label="Tanggal Lahir"
            value={user?.birth_date ? formatDate(user.birth_date) : "-"}
          />
          <InfoItem
            icon={<User />}
            label="Jenis Kelamin"
            value={user?.gender || "-"}
          />
          <InfoItem icon={<Phone />} label="No HP" value={user?.phone || "-"} />
          <InfoItem
            icon={<MapPin />}
            label="Alamat"
            value={user?.address || "-"}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
            <FileText size={20} />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Bio
          </h2>
        </div>

        <p className="text-slate-500 leading-relaxed">
          {user?.bio || "Belum ada bio."}
        </p>
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