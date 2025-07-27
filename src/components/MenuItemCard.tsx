import React, { useState } from 'react';
import { ZoomIn, Flame, Leaf, Trophy } from 'lucide-react';
import TagDisplay from './TagDisplay';
import { Language, getLocalizedContent } from '../hooks/useLanguage';

interface MenuItem {
  id: string;
  item_name: string;
  item_name_fr?: string;
  description: string;
  description_fr?: string;
  price: number;
  image_url?: string;
  tags?: string[];
}

interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  onClick: () => void;
}

const ItemTag = ({ type }: { type: string }) => {
  switch (type) {
    case 'spicy':
      return <span className="item-tag tag-spicy"><Flame className="w-3 h-3 mr-1" />Spicy</span>;
    case 'vegetarian':
      return <span className="item-tag tag-vegetarian"><Leaf className="w-3 h-3 mr-1" />Vegetarian</span>;
    case 'bestseller':
      return <span className="item-tag tag-bestseller"><Trophy className="w-3 h-3 mr-1" />Best Seller</span>;
    default:
      return <span className="item-tag tag-generic">{type.charAt(0).toUpperCase() + type.slice(1)}</span>;
  }
};

const ImageModal = ({ imageUrl, alt, isOpen, onClose }: {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
            aria-label="Close image"
          >
            <span className="text-2xl">×</span>
          </button>
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          />
        </div>
      </div>
    </>
  );
};

export default function MenuItemCard({ item, language, onClick }: MenuItemCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const localizedContent = getLocalizedContent(item, language);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageModalOpen(true);
  };

  const handleCardClick = () => {
    onClick();
  };

  const visibleTags = item.tags?.slice(0, 3) || [];
  const remainingCount = (item.tags?.length || 0) - visibleTags.length;

  return (
    <>
      <div className="menu-item-card cursor-pointer group relative transition-all duration-300" onClick={handleCardClick}>
        {item.image_url && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl z-0">
            <img
              src={item.image_url}
              alt={localizedContent.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Image zoom overlay */}
            <div 
              className="absolute top-3 left-3"
              onClick={handleImageClick}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <ZoomIn className="w-4 h-4 text-gray-800" />
              </div>
            </div>
          </div>
        )}

        <div className="p-5">
          <TagDisplay tags={item.tags || []} language={language} className="mb-2" />
          <h3 className="text-xl font-semibold mb-3 line-clamp-1">
            {localizedContent.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{localizedContent.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {item.image_url && (
        <ImageModal
          imageUrl={item.image_url}
          alt={localizedContent.name}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </>
  );
}
