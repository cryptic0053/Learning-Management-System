import React from "react";

const CourseCard = ({ course, onEnroll }) => {
  const {
    id,
    title,
    description,
    image,
    lessons,
    price,
    instructor,
  } = course;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      <img
        src={`http://localhost:8000${image}`}  // ✅ This fixes the image path
        alt={title}
        className="w-full h-40 object-cover"
        onError={(e) => (e.target.style.display = "none")}
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-gray-500 text-sm mb-2">{description?.slice(0, 70)}...</p>
        <p className="text-gray-400 text-xs mb-2">{lessons} lessons</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-black font-medium">${price}</p>
          <button
            onClick={() => onEnroll?.(id)}
            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
