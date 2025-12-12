import { Navigate } from "react-router-dom";

function UserRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default UserRoute;
