import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "@/lib/utils";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", video: "" });
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lessons/${lessonId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          video: data.video,
        });
      } catch (err) {
        setError("Failed to load lesson.");
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/lessons/${lessonId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate(-1); // go back
      } else {
        const data = await res.json();
        setError(data.detail || "Update failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Lesson</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea name="description" value={form.description} rows={3} onChange={handleChange} required />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input name="video" value={form.video} onChange={handleChange} required />
        </div>
        <Button type="submit">Update Lesson</Button>
      </form>
    </div>
  );
};

export default EditLesson;
