import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "@/lib/utils";
import { useAuth } from "@/providers/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use context login method

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const tokenRes = await fetch(`${BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(data.detail || "Invalid credentials");

      const profileRes = await fetch(`${BASE_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      const profileData = await profileRes.json();
      const user = profileData[0];

      // ✅ Call login from context
      login(user, data);

      // ✅ Redirect based on role
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
      else setError("Unknown user role.");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label>Username</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="/register" className="ml-1 text-primary underline">
              Register
            </a>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
