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
      const response = await axios.get(`${BASE_URL}/courses/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      set({ courses: response.data.results, loading: false });
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({ loading: false });
    }
  },

  // Fetch single course by ID
  fetchCourseById: async (id) => {
    set({ singleCourseLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      await axios.delete(`${BASE_URL}/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
