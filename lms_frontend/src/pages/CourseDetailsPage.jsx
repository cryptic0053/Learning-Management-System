import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import { BASE_URL } from "@/lib/utils";

export const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [lessonError, setLessonError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const courseRes = await fetch(`${BASE_URL}/courses/${courseId}/`);
        const courseData = await courseRes.json();
        setCourse(courseData);

        const lessonRes = await fetch(`${BASE_URL}/lessons/?course_id=${courseId}`, {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const lessonData = await lessonRes.json();
        const allLessons = lessonData.results || lessonData;

        const courseLessons = allLessons.filter(
          (lesson) =>
            lesson.course === courseData.id || lesson.course?.id === courseData.id
        );
        setLessons(courseLessons);
      } catch (err) {
        console.error("Error loading course/lessons:", err);
        setLessonError("Failed to load course or lessons.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchCourseAndLessons();
    }
  }, [courseId, token]);

  const handleEnroll = async () => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      alert("❌ Only students can enroll in courses.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/student/enroll/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to enroll.");
      alert("✅ Enrolled successfully!");
      window.location.reload();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading || !course) return <div>Loading...</div>;

  const {
    title,
    description,
    image,
    price,
    duration,
    category,
    instructor,
  } = course;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={image}
          alt={title}
          className="w-full md:w-1/2 h-auto rounded-lg shadow"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-600">{description}</p>
          <p className="text-sm text-muted-foreground">
            Category: {category?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            Instructor: {instructor?.full_name || instructor?.username}
          </p>
          <p className="text-sm text-muted-foreground">Duration: {duration}</p>
          <p className="text-lg font-semibold mt-2">${price}</p>

          <Button className="mt-4 w-fit" onClick={handleEnroll}>
            Enroll in this course
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
        {lessonError ? (
          <p className="text-gray-500">{lessonError}</p>
        ) : lessons.length > 0 ? (
          <ul className="space-y-2 list-disc pl-5">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <strong>{lesson.title}</strong> – {lesson.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No lessons added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
