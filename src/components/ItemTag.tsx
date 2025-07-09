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

interface ItemTagProps {
  type: string;
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

export default function ItemTag({ type }: ItemTagProps) {
  return (
    <span className="item-tag tag-generic flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full shadow-sm">
      {getEmojiIcon(type)}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
