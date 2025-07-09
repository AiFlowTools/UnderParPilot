import React, { useState } from 'react';
import { ZoomIn, Flame, Leaf, Trophy } from 'lucide-react';
import TagDisplay from './TagDisplay';

interface MenuItem {
  id: string;
  item_name: string;
  description: string;
  price: number;
  image_url?: string;
  tags?: string[];
}

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;1
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
      return null;
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

export default function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageModalOpen(true);
  };

  const handleCardClick = () => {
    onClick();
  };

  return (
    <>
      <div className="menu-item-card cursor-pointer group relative" onClick={handleCardClick}>
        {item.image_url && (
          <div className="relative h-48 w-full overflow-hidden z-0">
            <img
              src={item.image_url}
              alt={item.item_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Image zoom overlay */}
            <div 
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleImageClick}
            >
              <div className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-200 shadow-lg">
                <ZoomIn className="w-4 h-4 text-gray-800" />
              </div>
            </div>
            
            {/* Tags Display */}
            <TagDisplay tags={item.tags || []} />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>
        )}
        
        <div className="p-4">
          <div className="mb-2">
            {item.tags?.map(tag => <ItemTag key={tag} type={tag} />)}
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-200">
            {item.item_name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              ${item.price.toFixed(2)}
            </span>
            {item.tags?.length > 0 && (
  <div className="mt-1 flex flex-wrap gap-1">
    {item.tags.map((tag) => (
      <span
        key={tag}
        className={`text-xs font-semibold px-2 py-1 rounded-full ${
          tag.toLowerCase() === 'best seller'
            ? 'bg-yellow-200 text-yellow-800'
        }`}
      >
        {tag}
      </span>
    ))}
  </div>
)}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {item.image_url && (
        <ImageModal
          imageUrl={item.image_url}
          alt={item.item_name}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </>
  );
}