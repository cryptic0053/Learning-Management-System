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
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });
  const [banner, setBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load course info, categories, and lessons
  useEffect(() => {
    const fetchAll = async () => {
  try {
    const [courseRes, categoryRes, lessonRes] = await Promise.all([
      fetch(`${BASE_URL}/courses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/categories/`),
      fetch(`${BASE_URL}/lessons/?course_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const courseData = await courseRes.json();
    const categoryData = await categoryRes.json();
    const lessonData = await lessonRes.json();

    setFormData({
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      duration: courseData.duration,
      category: courseData.category.id,
    });

    setCategories(categoryData.results || categoryData);
    setLessons(lessonData.results || []);
  } catch (err) {
    console.error(err);
    setError("Failed to load course data.");
  }
};


    if (token) fetchAll();
    else navigate("/login");
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    if (banner) form.append("banner", banner);

    try {
      const res = await fetch(`${BASE_URL}/courses/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Update failed.");

      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const res = await fetch(`${BASE_URL}/lessons/${lessonId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      } else {
        throw new Error("Delete failed.");
      }
    } catch (err) {
      alert("Error deleting lesson.");
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Course</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="duration">Duration (hrs)</Label>
              <Input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
            <Input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Updating..." : "Update Course"}
          </Button>
        </form>

        {/* --- Lessons Section --- */}
        <hr className="my-8" />
        <div>
          <h2 className="text-xl font-semibold mb-3">Lessons / Modules</h2>
          <Button onClick={() => navigate(`/teacher/add-lesson/${id}`)} className="mb-4">
            ➕ Add Lesson
          </Button>

          {lessons.length === 0 ? (
            <p className="text-muted-foreground">No lessons yet.</p>
          ) : (
            <ul className="space-y-4">
              {lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="p-4 border rounded flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/teacher/edit-lesson/${lesson.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default EditCourse;
