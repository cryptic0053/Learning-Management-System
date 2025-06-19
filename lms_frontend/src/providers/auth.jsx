import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          // Verify token and get user info
          const response = await fetch(
            "https://lms-backend-xpwc.onrender.com/api/user/profile/student",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token might be expired, clear it
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (userData, tokens) => {
    // Store tokens
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);

    // Set user data
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
