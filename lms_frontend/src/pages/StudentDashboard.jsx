import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8000/api/student/courses/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch enrollments");
      const data = await res.json();
      setEnrollments(data.results || data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <main className="p-6 min-h-screen bg-muted/40">
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.username}</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {enrollments.length === 0 && !error && (
        <p className="text-sm text-gray-500">You haven't enrolled in any courses yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {enrollments.map((enroll) => {
          console.log("ENROLL DEBUG:", enroll);

          const course = enroll.course || {};
          const courseTitle =
            course.course_title || course.title || course.name || `Course ID ${enroll.course_id}`;
          const imageUrl = course.image
            ? course.image.startsWith("http")
              ? course.image
              : `http://localhost:8000${course.image}`
            : null;

          return (
            <Card key={`enroll-${enroll.id || enroll.course_id || Math.random()}`}>
              <CardHeader>
                <CardTitle>{courseTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={courseTitle}
                    className="h-40 w-full object-cover rounded mb-3"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <p className="text-sm">Progress: {enroll.progress || 0}%</p>
                <Progress value={enroll.progress || 0} className="mt-2" />
                {enroll.is_completed && (
                  <p className="text-green-600 font-medium mt-2">Completed ✅</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default StudentDashboard;
