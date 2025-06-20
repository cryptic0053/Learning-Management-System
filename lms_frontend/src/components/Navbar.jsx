"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="text-xl font-bold">LMS</Link>

        <div className="flex items-center space-x-4">
          <Link to="/courses">
            <Button variant="ghost" size="sm">All Courses</Button>
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === "student" && (
                <Link to="/student/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              )}

              {user?.role === "teacher" && (
                <Link to="/teacher/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              )}

              <Button onClick={logout} size="sm">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
