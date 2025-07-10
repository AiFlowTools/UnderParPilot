import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, ChevronUp, X, Wine, Menu as MenuIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import MenuItemDetail from '../components/MenuItemDetail';
import MenuItemCard from '../components/MenuItemCard';
import Header from '../components/Header';
import HowItWorksModal from '../components/HowItWorksModal';
import CartModal from '../components/CartModal';
import { RulerCarousel, type CarouselItem } from '../components/ui/ruler-carousel';
import { useCourse } from '../hooks/useCourse';

interface MenuItem {
  id: string;
  golf_course_id: string;
  category: string;
  item_name: string;
  description: string;
  price: number;
  image_url: string;
  tags?: string[];
  modifiers?: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedModifiers?: string[];
}

const categoryItems: CarouselItem[] = [
  { id: 1, title: 'Breakfast' },
  { id: 2, title: 'Lunch & Dinner' },
  { id: 3, title: 'Snacks' },
  { id: 4, title: 'Drinks' },
  { id: 5, title: 'Beer' },
  { id: 6, title: 'Pro Shop' },
];

export default function Menu() {
  const { course, loading: courseLoading, error: courseError } = useCourse();
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    if (!course?.id) return;

    setLoading(true);
    supabase
      .from('menu_items')
      .select('*')
      .eq('golf_course_id', course.id)
      .then(({ data, error: e }) => {
        if (e) throw e;

        const processedData = (data || []).map(item => ({
          ...item,
          tags: typeof item.tags === 'string'
            ? item.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : item.tags || [],
        }));

        setMenuItems(processedData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [course?.id]);

  const persist = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (
    item: MenuItem,
    quantity: number,
    selectedModifiers: string[] = []
  ) => {
    const newCart = [...cart];
    const existing = newCart.find(
      c => c.id === item.id &&
      JSON.stringify(c.selectedModifiers) === JSON.stringify(selectedModifiers)
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      newCart.push({ ...item, quantity, selectedModifiers });
    }

    setCart(newCart);
    persist(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const newCart = cart
      .map(c =>
        c.id === itemId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c
      )
      .filter(c => c.quantity > 0);
    setCart(newCart);
    persist(newCart);
  };

  const handleCategorySelect = (item: CarouselItem) => {
    setSelectedCategory(item.title);
  };

  const filteredItems = menuItems.filter(
    item => item.category === selectedCategory
  );

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  if (courseLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full" />
      </div>
    );
  }

  if (error || courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-2xl">
          <p className="text-gray-800 text-xl mb-4">
            {error || courseError || 'Course not found'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header
        onClick={() => setSelectedCategory('Breakfast')}
        onHowItWorksClick={() => setIsHowItWorksOpen(true)}
        className="cursor-pointer hover:opacity-90 transition-opacity"
      />

      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="sticky top-20 bg-gray-50 z-40 pt-2 pb-3">
          <RulerCarousel
            originalItems={categoryItems}
            onItemSelect={handleCategorySelect}
            selectedItem={selectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onClick={() => {
                setSelectedItem(item);
                setIsCartOpen(false); // auto-close cart when viewing item
              }}
            />
          ))}
        </div>
      </div>

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {selectedItem && (
        <MenuItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(qty, modifiers) => addToCart(selectedItem, qty, modifiers)}
          onCloseCart={() => setIsCartOpen(false)}
          isMobile={isMobile}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onToggle={() => {
          setIsCartOpen(!isCartOpen);
        }}
        onUpdateQuantity={updateQuantity}
      />
      {cart.length > 0 && !isCartOpen && (
  <div className="fixed bottom-0 inset-x-0 z-40">
    <button
      onClick={() => setIsCartOpen(true)}
      className="w-full bg-green-600 text-white p-4 flex items-center justify-between hover:bg-green-700 transition-colors"
    >
      <div className="flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2" />
        <span className="font-medium">
          {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • ${cartTotal.toFixed(2)}
        </span>
      </div>
      <ChevronUp className="w-5 h-5" />
    </button>
  </div>
)}
    </div>
  );
}
