const API_BASE_URL = "https://lms-backend-xpwc.onrender.com/api";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
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

// Specific API functions
export const coursesAPI = {
  getAll: () => apiRequest("/courses/"),
};

export const categoriesAPI = {
  getAll: () => apiRequest("/categories/"),
};
