const API_BASE_URL = "http://127.0.0.1:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Automatically add token if available
  const token = localStorage.getItem("accessToken");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),  // ✅ Add Bearer token if exists
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    return { data: null, error: error.message };
  }
};

// ✅ API wrappers
export const coursesAPI = {
  getAll: () => apiRequest("/courses/"),
};

export const categoriesAPI = {
  getAll: () => apiRequest("/categories/"),
};
