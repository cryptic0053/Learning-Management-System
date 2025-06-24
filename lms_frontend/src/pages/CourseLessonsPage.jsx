import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LessonCard from "@/components/LessonCard";

const CourseLessonsPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem("accessToken");

  const fetchLessons = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/courses/${courseId}/lessons/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load lessons");
      const data = await res.json();
      setLessons(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCompletedLessons = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/student/completed-lessons/${courseId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load completed lessons");

      const data = await res.json();
      // ✅ assuming the backend returns a flat list: [1, 2, 3]
      setCompletedLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const res = await fetch("http://localhost:8000/api/student/complete-lesson/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lesson_id: lessonId }),
      });

      if (!res.ok) throw new Error("Failed to mark lesson as complete");

      // Refresh progress from backend instead of assuming
      await fetchCompletedLessons();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchCompletedLessons();
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0) {
      setProgress(Math.round((completedLessons.length / lessons.length) * 100));
    }
  }, [completedLessons, lessons]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Lessons</h1>

      {error && <p className="text-red-500">{error}</p>}
      {!error && lessons.length === 0 && <p>No lessons found.</p>}

      <p className="mb-4 text-green-600">Progress: {progress}%</p>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={completedLessons.includes(lesson.id)}
            onComplete={markLessonComplete}
          />
        ))}
      </div>
    </main>
  );
};

export default CourseLessonsPage;
