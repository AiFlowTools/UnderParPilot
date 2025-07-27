import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ChevronLeft } from 'lucide-react';
import ItemTag from './ItemTag';
import { Language, getLocalizedContent, useLanguage } from '../contexts/LanguageContext';

interface MenuItemDetailProps {
  item: {
    id: string;
    item_name: string;
    item_name_fr?: string;
    description: string;
    description_fr?: string;
    price: number;
    image_url?: string;
    tags?: string[];
    modifiers?: {
      id: string;
      name: string;
      price: number;
    }[];
  };
  language: Language;
  onClose: () => void;
  onAddToCart: (quantity: number, selectedModifiers: string[]) => void;
  onCloseCart?: () => void; // ✅ Add this to props
  isMobile: boolean;
}

export default function MenuItemDetail({ item, language, onClose, onAddToCart, onCloseCart, isMobile }: MenuItemDetailProps) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const localizedContent = getLocalizedContent(item, language);

  // ✅ Auto-close cart drawer when detail opens
  useEffect(() => {
    if (onCloseCart) {
      console.log('[MenuItemDetail] Auto-closing cart...');
      onCloseCart();
    }
  }, []);

  const updateQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const toggleModifier = (modifierId: string) => {
    setSelectedModifiers(current =>
      current.includes(modifierId)
        ? current.filter(id => id !== modifierId)
        : [...current, modifierId]
    );
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedModifiers);
    onClose();
  };

  const totalPrice = (
    (item.price * quantity) +
    (item.modifiers?.filter(m => selectedModifiers.includes(m.id))
      .reduce((sum, m) => sum + m.price, 0) ?? 0)
  );

  const modalClasses = isMobile
    ? 'fixed inset-0 bg-white z-50 animate-slideUp'
    : 'fixed inset-0 z-50 flex items-center justify-center animate-fadeIn';

  const contentClasses = isMobile
    ? 'h-full overflow-y-auto'
    : 'bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className={modalClasses}>
        <div className={contentClasses}>
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 border-b">
            <div className="flex items-center justify-between p-4">
              {isMobile ? (
                <button onClick={onClose} className="p-2 -ml-2">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : (
                <div className="w-8" />
              )}
              <h2 className="text-lg font-semibold">{localizedContent.name}</h2>
              {!isMobile && (
                <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {item.image_url && (
              <div 
                className="w-full h-64 bg-cover bg-center rounded-xl mb-6"
                style={{ backgroundImage: `url(${item.image_url})` }}
              />
            )}
            <div className="mb-6">
              <p className="text-gray-600">{localizedContent.description}</p>
              <p className="text-xl font-bold mt-2">${item.price.toFixed(2)}</p>

              {/* Tags (with icon styling) */}
              {item.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <ItemTag key={idx} type={tag} language={language} />
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full shadow-sm">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('customize')}</h3>
                <div className="space-y-3">
                  {item.modifiers.map(modifier => (
                    <label
                      key={modifier.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div>
                        <span className="font-medium">{modifier.name}</span>
                        {modifier.price > 0 && (
                          <span className="text-sm text-gray-600 ml-2">
                            +${modifier.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedModifiers.includes(modifier.id)}
                        onChange={() => toggleModifier(modifier.id)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => updateQuantity(-1)}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(1)}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              {t('addToOrder')} • ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
