import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import CircularWithValueLabel from "./layouts/CircularProgressWithLabel.jsx";

const ProtectedRoute = ({ isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  console.log("🔍 ProtectedRoute state:", { loading, isAuthenticated, user });

  if (loading) return <CircularWithValueLabel />;

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
