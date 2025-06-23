import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "@/lib/utils";

const EditMaterial = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", file_type: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await fetch(`${BASE_URL}/materials/${materialId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          file_type: data.file_type,
        });
      } catch (err) {
        setError("Failed to load material.");
      }
    };

    fetchMaterial();
  }, [materialId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("file_type", form.file_type);
    if (file) data.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/materials/${materialId}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        navigate(-1); // back to previous
      } else {
        const result = await res.json();
        setError(result.detail || "Update failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Material</h2>
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
          <Textarea name="description" rows={3} value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <Label>File Type</Label>
          <Input name="file_type" value={form.file_type} onChange={handleChange} required />
        </div>
        <div>
          <Label>Replace File (optional)</Label>
          <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <Button type="submit">Update Material</Button>
      </form>
    </div>
  );
};

export default EditMaterial;
