import React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`border rounded p-2 w-full text-sm ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
