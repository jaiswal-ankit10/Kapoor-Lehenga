import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
