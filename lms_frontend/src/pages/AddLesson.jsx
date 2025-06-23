import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/lib/utils";

const AddLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    video: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${BASE_URL}/lessons/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, course: courseId }),
      });

      if (res.ok) {
        navigate(`/teacher/edit-course/${courseId}`);
      } else {
        const data = await res.json();
        setError(data.detail || "Error creating lesson.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Lesson</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" rows={3} value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="video">Video URL</Label>
          <Input name="video" value={form.video} onChange={handleChange} required />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Lesson"}
        </Button>
      </form>
    </div>
  );
};

export default AddLesson;
