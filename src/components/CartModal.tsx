import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from '../lib/translations';

interface CartItem {
  id: string;
  item_name: string;
  price: number;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  cart: CartItem[];
  cartItemCount: number;
  cartTotal: number;
  onToggle: () => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

const CartModal: React.FC<Props> = ({
  isOpen,
  cart,
  cartItemCount,
  cartTotal,
  onToggle,
  onUpdateQuantity
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md h-[80vh] overflow-hidden shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{t('ui.yourCart')}</h2>
          <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{item.item_name}</h4>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                >
                  –
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between text-base font-medium">
            <span>{t('ui.subtotal')}</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
          >
            {t('ui.proceedToCheckout')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
