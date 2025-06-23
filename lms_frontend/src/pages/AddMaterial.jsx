import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/lib/utils";

const AddMaterial = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", file_type: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const data = new FormData();

    data.append("title", form.title);
    data.append("description", form.description);
    data.append("file_type", form.file_type);
    data.append("course", courseId);
    if (file) data.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/materials/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        navigate(`/teacher/edit-course/${courseId}`);
      } else {
        const result = await res.json();
        setError(result.detail || "Upload failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Material</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input name="title" onChange={handleChange} required />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea name="description" rows={3} onChange={handleChange} required />
        </div>
        <div>
          <Label>File Type (e.g. pdf, image, doc)</Label>
          <Input name="file_type" onChange={handleChange} required />
        </div>
        <div>
          <Label>Upload File</Label>
          <Input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Material"}
        </Button>
      </form>
    </div>
  );
};

export default AddMaterial;
