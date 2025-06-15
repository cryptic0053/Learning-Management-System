import { useAuth } from "@/providers/auth";
import React from "react";

const StudentDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <p>Hello, {user?.username}</p>
    </div>
  );
};

export default StudentDashboard;
