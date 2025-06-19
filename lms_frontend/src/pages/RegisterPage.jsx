import React, { useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import { BASE_URL } from "@/lib/utils";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",        // default role
    mobile_no: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError("Username, email, and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      await fetch(`${BASE_URL}/users/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});


      const data = await res.json();
      console.log("REGISTER RES", data);

      if (res.ok) {
        alert("Registration successful! Please log in.");
        window.location.href = "/login";
      } else {
        setError(data.message || data.detail || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="w-full py-6 bg-background border-b">
        <div className="container px-4 md:px-6">
          <a href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </a>
        </div>
      </section>

      {/* Form */}
      <section className="flex-1 flex items-center justify-center py-12 bg-muted/30">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Fill in the form to register as a new user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile_no">Mobile No</Label>
                  <Input
                    id="mobile_no"
                    name="mobile_no"
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={formData.mobile_no}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <div className="text-center text-sm text-muted-foreground w-full">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Sign in
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
