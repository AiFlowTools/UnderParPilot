import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language, getLocalizedContent, useLanguage } from '../hooks/useLanguage';

interface CartItem {
  id: string;
  item_name: string;
  item_name_fr?: string;
  description_fr?: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface Props {
  isOpen: boolean;
  cart: CartItem[];
  cartItemCount: number;
  cartTotal: number;
  language: Language;
  onToggle: () => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

const CartModal: React.FC<Props> = ({
  isOpen,
  cart,
  cartItemCount,
  cartTotal,
  language,
  onToggle,
  onUpdateQuantity
}) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onToggle}
      />
      
      {/* Cart Modal with slide-up animation */}
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <div className="bg-white rounded-t-2xl w-full max-w-md h-[85vh] overflow-hidden shadow-2xl flex flex-col pointer-events-auto animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{t('yourCart')}</h2>
          <button 
            onClick={onToggle} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">{t('cartEmpty')}</p>
              <p className="text-gray-400 text-sm mt-2">{t('cartEmptyDescription')}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.map((item, index) => (
                const localizedContent = getLocalizedContent(item, language);
                            alt={localizedContent.name}
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-md transition-all duration-300"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    {/* Item Image */}
                    {item.image_url && (
                      <div className="flex-shrink-0">
                          {localizedContent.name}
                          src={item.image_url}
                          alt={item.item_name}
                          ${item.price.toFixed(2)} {t('each')}
                        />
                      </div>
                    )}
                    
                  {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base leading-tight">
                        {item.item_name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    
                    {/* Item Total */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-gray-900 text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                          aria-label={t('decreaseQuantity') || 'Decrease quantity'}
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center bg-gray-50 rounded-full p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900 text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label={t('increaseQuantity') || 'Increase quantity'}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Footer - Total & Checkout */}
            <div className="bg-white border-t border-gray-100 px-6 py-6 shadow-lg">
              {/* Total Row */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-gray-700">{t('total')}</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              
              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 active:scale-[0.98] shadow-md"
              >
                {t('proceedToCheckout')}
              </Link>
            </div>
          </>
        )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
