import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee, UtensilsCrossed, Pizza, Beer, Store, Wine,
  ShoppingBag, ChevronUp, X, Menu as MenuIcon, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import MenuItemDetail from '../components/MenuItemDetail';
import MenuItemCard from '../components/MenuItemCard';
import Header from '../components/Header';
import HowItWorksModal from '../components/HowItWorksModal';
import CartModal from '../components/CartModal';
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

const categories = [
  { id: 'Breakfast', name: 'Breakfast', icon: Coffee, emoji: '🍳' },
  { id: 'Lunch & Dinner', name: 'Lunch & Dinner', icon: UtensilsCrossed, emoji: '🍽️' },
  { id: 'Snacks', name: 'Snacks', icon: Pizza, emoji: '🥨' },
  { id: 'Drinks', name: 'Drinks', icon: Wine, emoji: '🥤' },
  { id: 'Beer', name: 'Beer', icon: Beer, emoji: '🍺' },
  { id: 'Pro Shop', name: 'Pro Shop', icon: Store, emoji: '⛳' },
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
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [headerShadow, setHeaderShadow] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
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

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeaderShadow(scrollY > 10);
      
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
 
  // Hide scroll hint after initial interaction or timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  const filteredItems = menuItems.filter(
    item => item.category === selectedCategory
  );

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const openHowItWorks = () => {
  setIsHowItWorksOpen(true);
  setIsCartOpen(false); // hide cart when opening modal
};

const closeHowItWorks = () => {
  setIsHowItWorksOpen(false);
  // Optionally: setIsCartOpen(true); // re-show cart after modal closes
};


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
      onHowItWorksClick={openHowItWorks}
      className={`cursor-pointer hover:opacity-90 transition-all duration-300 ${
        headerShadow ? 'shadow-md' : ''
      }`}
    />

    <div className="max-w-7xl mx-auto px-4 pt-24">
      {/* Category Navigation Pills */}
      <div className="sticky top-24 bg-gray-50/95 backdrop-blur-sm z-40 py-4 -mx-4 px-4 border-b border-gray-100">
        <div className="relative">
          <div 
            className="flex items-center overflow-x-auto scrollbar-hide pb-2 gap-3 scroll-smooth snap-x snap-mandatory"
            onScroll={() => setShowScrollHint(false)}
          >
            {categories.map(({ id, name, emoji }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 snap-start ${
                  selectedCategory === id
                    ? 'bg-green-600 text-white shadow-md font-semibold'
                    : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span className="whitespace-nowrap">{name}</span>
              </button>
            ))}
          </div>
          {/* Scroll hint gradient and arrow */}
          {showScrollHint && (
            <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
              <div className="animate-pulse">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <ChevronRight className="w-4 h-4 text-gray-400 -ml-2" />
              </div>
            </div>
          )}
        </div>
        {/* Pagination indicator */}
        <div className="flex items-center justify-center mt-3">
          <div className="text-sm text-gray-500 py-2">
            <span className="text-sm font-medium text-gray-700">
              {categories.findIndex(cat => cat.id === selectedCategory) + 1}
            </span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-700">
              {categories.length}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredItems.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>
    </div>

    <HowItWorksModal
  isOpen={isHowItWorksOpen}
  onClose={closeHowItWorks}
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

    {/* Floating Cart Pill */}
    {cart.length > 0 && isCartOpen && !isHowItWorksOpen &&(
      <div className="fixed bottom-0 left-0 w-full z-50 p-3">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full bg-green-600 text-white rounded-full shadow-lg cursor-pointer py-3 text-lg font-bold transition-all duration-200 ease-out active:scale-95 active:bg-green-700"
        >
          <div className="flex justify-between items-center gap-4 px-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-1.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="bg-white/20 rounded-full p-1">
              <ChevronUp className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    )}

  </div>
);
}
