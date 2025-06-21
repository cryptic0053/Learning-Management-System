import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth";
import { BASE_URL } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Unauthorized. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/student/courses/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Failed to load enrolled courses.");
        }

        const data = await res.json();
        setEnrollments(data.results || data); // Support pagination or plain array
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message || "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-muted/40">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username}</h1>

      {loading && <p>Loading your enrolled courses...</p>}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {enrollments.length === 0 && !loading && !error && (
        <p className="text-gray-600 text-sm">No enrollments yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrollments.map((item) => {
          const course = item.course || {};
          const progress = item.progress || 0;
          const isCompleted = item.is_completed || progress === 100;

          return (
            <Card key={item.id || course.id}>
              <CardHeader>
                <CardTitle>{course.title || "Untitled Course"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  {isCompleted
                    ? "✅ Completed"
                    : `🕒 Progress: ${Math.round(progress)}%`}
                </p>
                {!isCompleted && <Progress value={Math.round(progress)} />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default StudentDashboard;
