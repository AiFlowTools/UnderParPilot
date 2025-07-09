import React from 'react';

interface TagDisplayProps {
  tags: string[];
  className?: string;
}

const tagConfig: Record<string, { label: string; emoji: string; color: string }> = {
  spicy: { label: 'Spicy', emoji: '🌶️', color: 'bg-red-100 text-red-800' },
  vegetarian: { label: 'Vegetarian', emoji: '🥦', color: 'bg-green-100 text-green-800' },
  bestseller: { label: 'Best Seller', emoji: '🏆', color: 'bg-yellow-100 text-yellow-800' },
  glutenfree: { label: 'Gluten-Free', emoji: '🌾', color: 'bg-green-100 text-green-800' },
  dairyfree: { label: 'Dairy-Free', emoji: '🥛', color: 'bg-green-100 text-green-800' },
  vegan: { label: 'Vegan', emoji: '🥬', color: 'bg-green-100 text-green-800' },
  keto: { label: 'Keto', emoji: '🥩', color: 'bg-green-100 text-green-800' },
  lowcarb: { label: 'Low-Carb', emoji: '📉', color: 'bg-green-100 text-green-800' },
  organic: { label: 'Organic', emoji: '🍃', color: 'bg-green-100 text-green-800' },
  local: { label: 'Local', emoji: '📍', color: 'bg-green-100 text-green-800' },
};

export default function TagDisplay({ tags, className = '' }: TagDisplayProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleTags.map((rawTag, index) => {
        const normalizedTag = rawTag.toLowerCase().replace(/[^a-z]/g, '');
        const config = tagConfig[normalizedTag];

        return (
          <span
            key={index}
            className={`text-xs px-2 py-0.5 rounded-full shadow-sm ${
              config?.color ?? 'bg-gray-200 text-gray-800'
            }`}
          >
            {config ? `${config.emoji} ${config.label}` : rawTag}
          </span>
        );
      })}

      {remainingCount > 0 && (
        <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full shadow-sm">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
