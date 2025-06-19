import React from "react";
import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <div>
      DASHBOARD NAVBAR
      <Outlet />
    </div>
  );
};
