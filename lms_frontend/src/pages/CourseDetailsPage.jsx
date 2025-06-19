import { useCourseStore } from "@/store/courseStore";
import React, { useEffect } from "react";
import { useParams } from "react-router";

export const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { singleCourseLoading, singleCourse, fetchCourseById } =
    useCourseStore();
  console.log(singleCourse);

  useEffect(() => {
    fetchCourseById(courseId);
  }, [courseId]);

  if (singleCourseLoading) return <div>Loding....</div>;

  return (
    <div>
      <p>this is course details page of {singleCourse?.title}</p>
    </div>
  );
};
