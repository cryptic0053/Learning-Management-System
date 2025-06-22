// src/components/LessonForm.jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LessonForm = ({ lesson, onChange, onRemove }) => {
  return (
    <div className="border p-4 mb-4 rounded">
      <Label>Title</Label>
      <Input
        name="title"
        value={lesson.title}
        onChange={(e) => onChange("title", e.target.value)}
        required
      />
      <Label className="mt-2">Content</Label>
      <Input
        name="content"
        value={lesson.content}
        onChange={(e) => onChange("content", e.target.value)}
        required
      />
      <Button variant="destructive" className="mt-2" onClick={onRemove}>
        Remove Lesson
      </Button>
    </div>
  );
};

export default LessonForm;
