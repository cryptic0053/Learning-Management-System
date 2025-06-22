import { useCourseStore } from "@/store/courseStore";
import React, { useEffect } from "react";
import { redirect, useParams,useNavigate } from "react-router-dom"; // useRouter → useRouterDom
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import { BASE_URL } from "@/lib/utils";

export const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { singleCourseLoading, singleCourse, fetchCourseById } = useCourseStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseById(courseId);
  }, [courseId]);

  const handleEnroll = async () => {
  const token = localStorage.getItem("accessToken");

  // 🧠 Case 1: Not logged in
  if (!token || !user) {
    navigate('/login')
    return;
  }

  // 🧠 Case 2: Logged in but not a student
  if (user.role !== "student") {
    alert("❌ Only students can enroll in courses.");
    return;
  }

  // 🧠 Case 3: Student - Proceed
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
  } catch (err) {
    alert("❌ " + err.message);
  }
};

  if (singleCourseLoading || !singleCourse) return <div>Loading...</div>;

  const {
    title,
    description,
    image,
    price,
    duration,
    category,
    instructor,
    lessons,
  } = singleCourse;

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
          <p className="text-sm text-muted-foreground">Category: {category?.title}</p>
          <p className="text-sm text-muted-foreground">Instructor: {instructor?.full_name || instructor?.username}</p>
          <p className="text-sm text-muted-foreground">Duration: {duration}</p>
          <p className="text-lg font-semibold mt-2">${price}</p>

          <Button className="mt-4 w-fit" onClick={handleEnroll}>
            Enroll in this course
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
        {lessons?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
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
