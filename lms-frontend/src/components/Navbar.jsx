"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import { Link } from "react-router";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally redirect to home page
    window.location.href = "/";
  };

  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">LMS</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/courses">
            <Button variant="ghost" size="sm">
              All Courses
            </Button>
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
                  <Button variant="ghost" size="sm">
                    Teach
                  </Button>
                </Link>
              )}

              <Button onClick={handleLogout} size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
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
