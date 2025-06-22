import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../lib/utils";

export const useCourseStore = create((set) => ({
  courses: [],
  singleCourse: null,
  loading: false,
  singleCourseLoading: false,

  // ✅ Fetch all courses
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
      };

      // ✅ Only attach token if present
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${BASE_URL}/courses/`, { headers });

      set({ courses: response.data.results || response.data, loading: false });
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      set({ loading: false });
    }
  },

  // ✅ Fetch single course
  fetchCourseById: async (id) => {
    set({ singleCourseLoading: true });
    try {
      const token = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${BASE_URL}/courses/${id}/`, { headers });

      set({ singleCourse: response.data, singleCourseLoading: false });
    } catch (error) {
      console.error("❌ Error fetching course:", error);
      set({ singleCourseLoading: false });
    }
  },

  // ✅ Delete course (still requires auth)
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
      console.error("❌ Error deleting course:", error);
    }
  },
}));
