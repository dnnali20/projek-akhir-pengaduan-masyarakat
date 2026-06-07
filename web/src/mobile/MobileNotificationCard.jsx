import { Link } from "react-router-dom";

export default function MobileNotificationCard({ item, formatDate }) {
  return (
    <Link
      to={item.link}
      className="bg-white rounded-3xl shadow border border-slate-100 p-5 flex gap-4"
    >
      <div className={`${item.color} p-3 rounded-2xl h-fit`}>
        {item.icon}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-slate-800">
          {item.title}
        </h3>

        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {item.message}
        </p>

        <p className="text-xs text-slate-400 mt-3">
          {formatDate(item.date)}
        </p>
      </div>
    </Link>
  );
}