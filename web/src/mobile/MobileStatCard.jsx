export default function MobileStatCard({ title, value, icon, bg, text }) {
  return (
    <div className="bg-white rounded-3xl shadow border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div className={`${bg} ${text} p-3 rounded-2xl`}>
          {icon}
        </div>

        <h2 className="text-2xl font-bold text-slate-800">
          {value}
        </h2>
      </div>

      <p className="text-sm text-slate-500 mt-4">
        {title}
      </p>
    </div>
  );
}