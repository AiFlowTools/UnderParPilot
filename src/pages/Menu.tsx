import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Coffee, UtensilsCrossed, Pizza, Beer, Store, ShoppingBag, ChevronUp, Flame, Leaf, Trophy, X, Wine, Menu as MenuIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MenuItemDetail from '../components/MenuItemDetail';
import Header from '../components/Header';

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
  { id: 'Breakfast', name: 'Breakfast', icon: Coffee, color: 'bg-amber-100' },
  { id: 'Lunch & Dinner', name: 'Lunch &\nDinner', icon: UtensilsCrossed, color: 'bg-blue-100' },
  { id: 'Snacks', name: 'Snacks', icon: Pizza, color: 'bg-red-100' },
  { id: 'Drinks', name: 'Drinks', icon: Wine, color: 'bg-purple-100' },
  { id: 'Beer', name: 'Beer', icon: Beer, color: 'bg-yellow-100' },
  { id: 'Pro Shop', name: 'Pro Shop', icon: Store, color: 'bg-purple-100' }
];

export default function Menu() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Breakfast');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

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
    if (!courseId) {
      setError('No golf course ID provided');
      setLoading(false);
      return;
    }
    supabase
      .from('menu_items')
      .select('*')
      .eq('golf_course_id', courseId)
      .then(({ data, error: e }) => {
        if (e) throw e;
        setMenuItems(data || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const persist = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (item: MenuItem, quantity: number, selectedModifiers: string[] = []) => {
    const newCart = [...cart];
    const existing = newCart.find(c => 
      c.id === item.id && 
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
      .map(c => (c.id === itemId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
      .filter(c => c.quantity > 0);
    setCart(newCart);
    persist(newCart);
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCategoryDrawerOpen(false);
  };

  const ItemTag = ({ type }: { type: string }) => {
    switch (type) {
      case 'spicy':
        return (
          <span className="item-tag tag-spicy">
            <Flame className="w-3 h-3 mr-1" />
            Spicy
          </span>
        );
      case 'vegetarian':
        return (
          <span className="item-tag tag-vegetarian">
            <Leaf className="w-3 h-3 mr-1" />
            Vegetarian
          </span>
        );
      case 'bestseller':
        return (
          <span className="item-tag tag-bestseller">
            <Trophy className="w-3 h-3 mr-1" />
            Best Seller
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-gray-800 text-xl mb-4">{error}</p>
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
      {/* Fixed Banner Header */}
      <Header 
        onClick={() => setSelectedCategory('Breakfast')}
        className="cursor-pointer hover:opacity-90 transition-opacity"
      />

      <div className="max-w-7xl mx-auto px-4 pt-24">
        {/* Categories */}
        <div className="sticky top-20 bg-gray-50 z-10 py-4">
          <div className="flex items-center overflow-x-auto pb-4 gap-4 -mx-4 px-4">
            <button
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open category menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            {categories.map(({ id, name, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`category-icon flex-shrink-0 ${color} ${
                  selectedCategory === id ? 'active' : ''
                }`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium whitespace-pre-line">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="menu-item-card cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {item.image_url && (
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image_url})` }}
                />
              )}
              <div className="p-4">
                <div className="mb-2">
                  {item.tags?.map(tag => (
                    <ItemTag key={tag} type={tag} />
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.item_name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Drawer */}
      {isCategoryDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsCategoryDrawerOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[85vh] flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Menu Categories</h2>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Category List */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
              {categories.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleCategorySelect(id)}
                  className={`w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                    selectedCategory === id 
                      ? 'bg-green-50 text-green-600 font-medium border-l-4 border-green-600' 
                      : ''
                  }`}
                >
                  <Icon className="w-6 h-6 mr-4" />
                  <span className="text-base">{id}</span>
                </button>
              ))}
              {/* Extra padding at bottom to account for home bar on mobile */}
              <div className="h-safe" />
            </div>
          </div>
        </>
      )}

      {/* Menu Item Detail Modal */}
      {selectedItem && (
        <MenuItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(quantity, selectedModifiers) => 
            addToCart(selectedItem, quantity, selectedModifiers)
          }
          isMobile={isMobile}
        />
      )}

      {/* Sticky Cart Preview Bar */}
      {cart.length > 0 && (
        <div className={`cart-drawer ${isCartOpen ? 'animate-slideUp' : ''}`}>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="w-full bg-[#28a745] text-white p-4 flex items-center justify-between hover:bg-[#218838] transition-colors"
          >
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • ${cartTotal.toFixed(2)}
              </span>
            </div>
            {isCartOpen ? <X className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
            
          {isCartOpen && (
            <div className="bg-white p-4 space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.item_name}</h4>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, -1);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <Link
                to={`/checkout/${courseId}`}
                className="block w-full mobile-button bg-[#28a745] text-white text-center hover:bg-[#218838]"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}