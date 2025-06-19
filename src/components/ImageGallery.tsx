import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: {
    id: string;
    url: string;
    alt: string;
    title?: string;
  }[];
  className?: string;
}

interface ImageModalProps {
  image: {
    id: string;
    url: string;
    alt: string;
    title?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Image */}
          <img
            src={image.url}
            alt={image.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 transform scale-100 hover:scale-105"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          />
          
          {/* Title */}
          {image.title && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <h3 className="text-lg font-semibold">{image.title}</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);

  const openModal = (image: typeof images[0]) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            onClick={() => openModal(image)}
          >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                  <ZoomIn className="w-6 h-6 text-gray-800" />
                </div>
              </div>
            </div>
            
            {/* Title */}
            {image.title && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {image.title}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <ImageModal
        image={selectedImage!}
        isOpen={!!selectedImage}
        onClose={closeModal}
      />
    </>
  );
};

export default ImageGallery;