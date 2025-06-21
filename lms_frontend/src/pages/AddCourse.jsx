import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/lib/utils";
import { useNavigate } from "react-router-dom";


const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });
  const [banner, setBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch category list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        setCategories(data.results || data); // Pagination safe
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You are not authenticated.");
      setLoading(false);
      return;
    }

    const body = new FormData();
    body.append("title", formData.title);
    body.append("description", formData.description);
    body.append("price", formData.price);
    body.append("duration", formData.duration);
    body.append("category", formData.category); // Must be category ID
    if (banner) {
      body.append("banner", banner); // Important for image
    }

    try {
      const res = await fetch(`${BASE_URL}/courses/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT manually set Content-Type with FormData
        },
        body,
      });

      const result = await res.json();
      if (response.ok) {
    setSuccess('Course created successfully!');
    setTimeout(() => {
        navigate('/'); // Or change to '/all-courses' or '/courses' based on your route
    }, 1000);
} else {
        console.error(result);
        setError(result.detail || "Course creation failed.");
      }
    } catch (err) {
      console.error("Error during creation", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Course</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="banner">Course Banner</Label>
            <input
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
              onChange={(e) => setBanner(e.target.files[0])}
              className="w-full text-sm border rounded p-2"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AddCourse;
