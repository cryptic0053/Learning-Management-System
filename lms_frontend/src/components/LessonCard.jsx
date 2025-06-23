import { useEffect, useState } from "react";

const LessonCard = ({ lesson, isCompleted, onComplete }) => {
  return (
    <div className="p-4 border rounded shadow mb-3 bg-white">
      <h3 className="text-lg font-bold">{lesson.title}</h3>
      <p className="text-sm text-gray-700">{lesson.description}</p>
      <div className="mt-2">
        <a href={lesson.video} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Watch Video
        </a>
      </div>
      {!isCompleted && (
        <button
          onClick={() => onComplete(lesson.id)}
          className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
        >
          Mark as Completed
        </button>
      )}
      {isCompleted && <p className="text-green-600 mt-2">✅ Completed</p>}
    </div>
  );
};

export default LessonCard;
