import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "@/lib/utils";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const token = localStorage.getItem("accessToken");

  

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${BASE_URL}/courses/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          duration: data.duration,
          category: data.category, // Should be ID
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load course. Please login again.");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCategories(data.results || data);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };

    if (token) {
      fetchCourse();
      fetchCategories();
    }
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("duration", formData.duration);
    form.append("category", formData.category);
    if (banner) form.append("banner", banner);

    try {
      const res = await fetch(`${BASE_URL}/courses/${id}/`, {
        method: "PATCH", // ✅ Use PATCH, not PUT
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();
      if (res.ok) {
        navigate("/teacher/dashboard");
      } else {
        setError(result.detail || "Update failed. Check your inputs.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Course</h1>

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
              value={formData.description}
              rows={4}
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
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Updating..." : "Update Course"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default EditCourse;
