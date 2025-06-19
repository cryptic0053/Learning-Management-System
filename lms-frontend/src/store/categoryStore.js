import { BASE_URL } from "@/lib/utils";
import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  //state
  categories: [{ id: "all", title: "All Courses" }],
  activeCategory: "all",
  loading: false,
  error: null,

  //actions
  fetchCategory: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const data = await response.json();
      const allCategories = [{ id: "all", title: "All Courses" }, ...data];
      set({ categories: allCategories, loading: false });
    } catch (error) {
      set({
        error: "Failed to Get Categories",
        loading: false,
      });
    }
  },

  setActiveCategory: (categoryId) => {
    set({ activeCategory: categoryId });
  },

  clearError: () => {
    set({ error: null });
  },
}));
