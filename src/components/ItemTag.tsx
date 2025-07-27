import React from 'react';
import {
  Flame,
  Leaf,
  Trophy,
  Smile,
  Star,
  Drumstick,
  IceCream,
  Wheat,
  Milk,
  Circle,
  Globe
} from 'lucide-react';
import { Language, useLanguage } from '../hooks/useLanguage';

interface ItemTagProps {
  type: string;
  language?: Language;
}

const getEmojiIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'spicy':
      return <Flame className="w-3 h-3 mr-1" />;
    case 'vegetarian':
      return <Leaf className="w-3 h-3 mr-1" />;
    case 'bestseller':
      return <Trophy className="w-3 h-3 mr-1" />;
    case 'gluten-free':
      return <Wheat className="w-3 h-3 mr-1" />;
    case 'dairy-free':
      return <Milk className="w-3 h-3 mr-1" />;
    case 'vegan':
      return <Smile className="w-3 h-3 mr-1" />;
    case 'keto':
      return <Drumstick className="w-3 h-3 mr-1" />;
    case 'low-carb':
      return <IceCream className="w-3 h-3 mr-1" />;
    case 'organic':
      return <Star className="w-3 h-3 mr-1" />;
    case 'local':
      return <Globe className="w-3 h-3 mr-1" />;
    default:
      return <Circle className="w-3 h-3 mr-1" />;
  }
};

const getLocalizedTagLabel = (type: string, t: (key: string) => string): string => {
  const tagMap: Record<string, string> = {
    'spicy': t('spicy'),
    'vegetarian': t('vegetarian'),
    'bestseller': t('bestseller'),
    'gluten-free': t('glutenFree'),
    'glutenfree': t('glutenFree'),
    'dairy-free': t('dairyFree'),
    'dairyfree': t('dairyFree'),
    'vegan': t('vegan'),
    'keto': t('keto'),
    'low-carb': t('lowCarb'),
    'lowcarb': t('lowCarb'),
    'organic': t('organic'),
    'local': t('local'),
  };
  
  return tagMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ItemTag({ type, language }: ItemTagProps) {
  const { t } = useLanguage();
  
  return (
    <span className="item-tag tag-generic flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full shadow-sm">
      {getEmojiIcon(type)}
      {getLocalizedTagLabel(type, t)}
    </span>
  );
}
