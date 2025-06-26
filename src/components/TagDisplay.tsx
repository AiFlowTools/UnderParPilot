import React from 'react';

interface TagDisplayProps {
  tags: string[];
  className?: string;
}

export default function TagDisplay({ tags, className = '' }: TagDisplayProps) {
  // Handle empty/null tags gracefully
  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <div 
      className={`absolute top-2 right-2 flex flex-wrap gap-1 ${className}`}
      role="group"
      aria-label="Item tags"
    >
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full shadow-sm hover:bg-gray-300 transition-colors duration-200"
          role="badge"
          aria-label={`Tag: ${tag}`}
        >
          {tag}
        </span>
      ))}
      
      {remainingCount > 0 && (
        <span
          className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full shadow-sm hover:bg-gray-400 transition-colors duration-200"
          role="badge"
          aria-label={`${remainingCount} more tags`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}