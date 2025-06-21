import React, { useEffect } from "react";
import { useCourseStore } from "@/store/courseStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses, deleteCourse } = useCourseStore();
  const teacherId = JSON.parse(localStorage.getItem("userData"))?.id;

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(id);
      fetchCourses(); // refresh after delete
    }
  };

  const teacherCourses = courses.filter(
    (course) =>
      course.instructor === teacherId || course.instructor?.id === teacherId
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Courses</h2>
        <Button onClick={() => navigate("/teacher/add-course")}>
          Add New Course
        </Button>
      </div>

      {teacherCourses.length === 0 ? (
        <p className="text-muted-foreground">You have not created any courses yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {teacherCourses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow-sm">
              <img
                src={course.banner || "/placeholder.svg"}
                alt={course.title}
                className="h-40 w-full object-cover mb-2 rounded"
              />
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                {course.description}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/teacher/edit-course/${course.id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
