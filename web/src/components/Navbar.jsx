import { useMemo } from "react";

export default function Navbar() {
  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  return (
    <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="font-bold text-lg md:text-xl text-gray-800">
          Sistem Pengaduan
        </h2>

        <p className="text-xs md:text-sm text-gray-500">
          Laporkan masalah lingkungan sekitar
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="font-semibold text-sm md:text-base text-gray-800">
            {user?.name}
          </p>

          <p className="text-xs md:text-sm text-blue-600 capitalize">
            {user?.role}
          </p>
        </div>
      </div>
    </header>
  );
}

