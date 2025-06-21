import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../lib/utils";

export const useCourseStore = create((set) => ({
  courses: [],
  singleCourse: null,
  loading: false,
  singleCourseLoading: false,

  // Fetch all courses
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken"); // ✅ Correct token key

      const response = await axios.get(`${BASE_URL}/courses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ courses: response.data.results || response.data, loading: false });
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({ loading: false });
    }
  },

  // Fetch single course by ID
  fetchCourseById: async (id) => {
    set({ singleCourseLoading: true });
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${BASE_URL}/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ singleCourse: response.data, singleCourseLoading: false });
    } catch (error) {
      console.error("Error fetching course:", error);
      set({ singleCourseLoading: false });
    }
  },

  // Delete course by ID
  deleteCourse: async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`${BASE_URL}/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        courses: state.courses.filter((course) => course.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  },
}));
