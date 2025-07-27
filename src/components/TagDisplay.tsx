import React from 'react';
import { Language, useLanguage } from '../contexts/LanguageContext';

interface TagDisplayProps {
  tags: string[];
  language?: Language;
  className?: string;
}

const getTagConfig = (type: string, t: (key: string) => string) => {
  const configs: Record<string, { labelKey: string; emoji: string; bg: string; text: string }> = {
    spicy: { labelKey: 'spicy', emoji: '🌶️', bg: 'bg-red-100', text: 'text-red-800' },
    vegetarian: { labelKey: 'vegetarian', emoji: '🥦', bg: 'bg-green-100', text: 'text-green-800' },
    bestseller: { labelKey: 'bestseller', emoji: '🏆', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    glutenfree: { labelKey: 'glutenFree', emoji: '🌾', bg: 'bg-green-100', text: 'text-green-800' },
    dairyfree: { labelKey: 'dairyFree', emoji: '🥛', bg: 'bg-green-100', text: 'text-green-800' },
    vegan: { labelKey: 'vegan', emoji: '🥬', bg: 'bg-green-100', text: 'text-green-800' },
    keto: { labelKey: 'keto', emoji: '🥓', bg: 'bg-green-100', text: 'text-green-800' },
    lowcarb: { labelKey: 'lowCarb', emoji: '📉', bg: 'bg-green-100', text: 'text-green-800' },
    organic: { labelKey: 'organic', emoji: '🌱', bg: 'bg-green-100', text: 'text-green-800' },
    local: { labelKey: 'local', emoji: '📍', bg: 'bg-green-100', text: 'text-green-800' },
  };

  const config = configs[type.toLowerCase().replace(/[^a-z]/g, '')];
  return config ? { ...config, label: t(config.labelKey) } : null;
};

export default function TagDisplay({ tags, language, className = '' }: TagDisplayProps) {
  const { t } = useLanguage();
  
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleTags.map((rawTag, index) => {
        const normalizedTag = rawTag.toLowerCase().replace(/[^a-z]/g, '');
        const config = getTagConfig(normalizedTag, t);

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
