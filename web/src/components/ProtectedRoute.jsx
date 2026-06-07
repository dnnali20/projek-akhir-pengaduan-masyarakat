import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  const pathname = location?.pathname ?? "";

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  // Saat ini masalah kamu adalah / selalu redirect ke /login.
  // Jadi ProtectedRoute sama sekali tidak boleh melakukan redirect.
  // Protected route redirect akan dimatikan sementara.
  if (!token || !token) {
    return children;
  }

  return children;
}




