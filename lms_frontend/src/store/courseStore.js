import { BASE_URL } from "@/lib/utils";
import { create } from "zustand";

export const useCourseStore = create((set) => ({
  //state
  courses: [],
  singleCourse: null,
  loading: false,
  singleCourseLoading: false,
  error: null,
  singleCourseError: null,

  //actions
  fetchCourses: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/courses`);
      const data = await response.json();
      set({ courses: data.results, loading: false });
    } catch (error) {
      set({
        error: "Failed to Get Courses",
        loading: false,
      });
    }
  },

  fetchCourseById: async (courseId) => {
    set({ singleCourseLoading: true, singleCourseError: null });

    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`);
      const data = await response.json();
      set({ singleCourse: data, singleCourseLoading: false });
    } catch (error) {
      set({
        singleCourseError: "Failed to Get Course Details",
        singleCourseLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearSingleCourseError: () => {
    set({ singleCourseError: null });
  },
}));
