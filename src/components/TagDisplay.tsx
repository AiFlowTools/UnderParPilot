import React from 'react';

interface TagDisplayProps {
  tags: string[];
  className?: string;
}

const tagConfig: Record<
  string,
  { label: string; emoji: string; bg: string; text: string }
> = {
  spicy: { label: 'Spicy', emoji: '🌶️', bg: 'bg-red-100', text: 'text-red-800' },
  vegetarian: { label: 'Vegetarian', emoji: '🥦', bg: 'bg-green-100', text: 'text-green-800' },
  bestseller: { label: 'Best Seller', emoji: '🏆', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  glutenfree: { label: 'Gluten-Free', emoji: '🌾', bg: 'bg-green-100', text: 'text-green-800' },
  dairyfree: { label: 'Dairy-Free', emoji: '🥛', bg: 'bg-green-100', text: 'text-green-800' },
  vegan: { label: 'Vegan', emoji: '🥬', bg: 'bg-green-100', text: 'text-green-800' },
  keto: { label: 'Keto', emoji: '🥓', bg: 'bg-green-100', text: 'text-green-800' },
  lowcarb: { label: 'Low-Carb', emoji: '📉', bg: 'bg-green-100', text: 'text-green-800' },
  organic: { label: 'Organic', emoji: '🌱', bg: 'bg-green-100', text: 'text-green-800' },
  local: { label: 'Local', emoji: '📍', bg: 'bg-green-100', text: 'text-green-800' },
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
            className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full shadow-sm ${config?.bg ?? 'bg-gray-200'} ${config?.text ?? 'text-gray-800'}`}
          >
            {config?.emoji && <span className="mr-1 text-sm">{config.emoji}</span>}
            {config?.label ?? rawTag}
          </span>
        );
      })}

      {remainingCount > 0 && (
        <span className="text-xs font-medium bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full shadow-sm">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
