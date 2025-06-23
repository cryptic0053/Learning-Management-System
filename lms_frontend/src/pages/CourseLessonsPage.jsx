import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LessonCard from "../components/LessonCard";

const CourseLessonsPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/courses/${courseId}/lessons/`)
      .then((res) => res.json())
      .then((data) => setLessons(data));
  }, [courseId]);

  useEffect(() => {
    fetch(`/api/course/${courseId}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProgress(data.progress);
        setCompleted(data.completedLessons || []);
      });
  }, [courseId, token]);

  const markLessonCompleted = async (lessonId) => {
    const res = await fetch(`/api/lesson/mark-completed/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lesson: lessonId }),
    });

    if (res.ok) {
      setCompleted([...completed, lessonId]);
      setProgress((prev) => prev + 100 / lessons.length); // basic update
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Course Lessons</h1>
      <p className="mb-2 text-gray-700">Progress: {progress.toFixed(0)}%</p>
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          isCompleted={completed.includes(lesson.id)}
          onComplete={markLessonCompleted}
        />
      ))}
    </div>
  );
};

export default CourseLessonsPage;
