import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/teacher/courses/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/courses/${courseId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete course");

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error(err);
      setError("Error deleting course.");
    }
  };

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  return (
    <main className="p-6 min-h-screen bg-muted/40">
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.username}</h1>
      <Button
        onClick={() => navigate("/teacher/add-course")}
        className="mb-6 bg-black text-white hover:bg-gray-800"
      >
        ➕ Create New Course
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {courses.length === 0 && !error && (
        <p className="text-sm text-gray-500">
          You haven't created any courses yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courses.map((course) => {
          const imageUrl = course.image?.startsWith("http")
            ? course.image
            : `http://localhost:8000${course.image}`;

          return (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title || "Untitled Course"}</CardTitle>
              </CardHeader>
              <CardContent>
                {course.image && (
                  <img
                    src={imageUrl}
                    alt={course.title}
                    className="h-40 w-full object-cover rounded mb-3"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <p className="text-sm text-gray-600">
                  {course.description?.slice(0, 100)}...
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Total Lessons: {course.lessons}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/teacher/edit-course/${course.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default TeacherDashboard;
