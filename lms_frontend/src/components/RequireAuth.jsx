import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!token || !userData) {
    return <Navigate to="/login" />;
  }

  // Only allow if role matches
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default RequireAuth;
