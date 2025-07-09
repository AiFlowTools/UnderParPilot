import React from 'react';

interface TagDisplayProps {
  tags: string[];
  className?: string;
}

const tagStyles: Record<
  string,
  { color: string; emoji: string; label: string }
> = {
  spicy: { color: 'bg-red-100 text-red-800', emoji: '🌶️', label: 'Spicy' },
  vegetarian: {
    color: 'bg-green-100 text-green-800',
    emoji: '🥦',
    label: 'Vegetarian',
  },
  bestseller: {
    color: 'bg-yellow-100 text-yellow-800',
    emoji: '🏆',
    label: 'Best Seller',
  },
  glutenfree: {
    color: 'bg-emerald-100 text-emerald-800',
    emoji: '🌾',
    label: 'Gluten-Free',
  },
  dairyfree: {
    color: 'bg-emerald-100 text-emerald-800',
    emoji: '🥛',
    label: 'Dairy-Free',
  },
  vegan: {
    color: 'bg-emerald-100 text-emerald-800',
    emoji: '🌱',
    label: 'Vegan',
  },
  keto: { color: 'bg-emerald-100 text-emerald-800', emoji: '🥩', label: 'Keto' },
  lowcarb: {
    color: 'bg-emerald-100 text-emerald-800',
    emoji: '⚖️',
    label: 'Low-Carb',
  },
  organic: {
    color: 'bg-emerald-100 text-emerald-800',
    emoji: '🍃',
    label: 'Organic',
  },
  local: {
    color: 'bg-emerald-100 text-emerald-800',
    emoji: '📍',
    label: 'Local',
  },
};

export default function TagDisplay({ tags, className = '' }: TagDisplayProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <div
      className={`absolute top-2 right-2 flex flex-wrap gap-1 ${className}`}
      role="group"
      aria-label="Item tags"
    >
      {visibleTags.map((tag, index) => {
        const normalized = tag.toLowerCase().replace(/[\s-]/g, '');
        const { color, emoji, label } = tagStyles[normalized] || {
          color: 'bg-gray-200 text-gray-800',
          emoji: '',
          label: tag,
        };

        return (
          <span
            key={index}
            className={`text-xs px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${color}`}
            role="badge"
            aria-label={`Tag: ${label}`}
          >
            {emoji && <span>{emoji}</span>}
            {label}
          </span>
        );
      })}

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
