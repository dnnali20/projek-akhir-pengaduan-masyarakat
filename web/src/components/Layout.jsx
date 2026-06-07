import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "../mobile/MobileNav";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 pb-28 md:pb-0">
        <Navbar />

        <div className="p-4 md:p-6">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}

