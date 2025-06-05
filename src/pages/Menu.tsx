import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Coffee,
  UtensilsCrossed,
  Pizza,
  Beer,
  Sandwich,
  Store,
  ShoppingBag,
  ChevronUp,
  Flame,
  Leaf,
  Trophy,
  X,
  Wine
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import MenuItemDetail from '../components/MenuItemDetail';
import debounce from 'lodash/debounce';

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
  { id: 'Lunch & Dinner', name: 'Lunch & Dinner', icon: UtensilsCrossed, color: 'bg-blue-100' },
  { id: 'Snacks', name: 'Snacks', icon: Pizza, color: 'bg-red-100' },
  { id: 'Drinks', name: 'Drinks', icon: Wine, color: 'bg-purple-100' },
  { id: 'Beer', name: 'Beer', icon: Beer, color: 'bg-yellow-100' },
  { id: 'Pro Shop', name: 'Pro Shop', icon: Store, color: 'bg-purple-100' }
];

export default function Menu() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Breakfast');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const isMobile = window.innerWidth < 768;

  // Cache for search results
  const searchCache = useMemo(() => new Map<string, MenuItem[]>(), []);

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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string, items: MenuItem[]) => {
      if (!query.trim()) return items;
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Check cache first
      if (searchCache.has(normalizedQuery)) {
        return searchCache.get(normalizedQuery);
      }

      // Perform search
      const results = items.filter(item => {
        const nameMatch = item.item_name.toLowerCase().includes(normalizedQuery);
        const descMatch = item.description?.toLowerCase().includes(normalizedQuery);
        return nameMatch || descMatch;
      }).sort((a, b) => {
        // Sort by relevance: name matches first, then description matches
        const aNameMatch = a.item_name.toLowerCase().includes(normalizedQuery);
        const bNameMatch = b.item_name.toLowerCase().includes(normalizedQuery);
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });

      // Cache results
      searchCache.set(normalizedQuery, results);
      return results;
    }, 300),
    []
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems.filter(item => item.category === selectedCategory);
    }
    return debouncedSearch(searchQuery, menuItems) || [];
  }, [searchQuery, menuItems, selectedCategory, debouncedSearch]);

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

  const handleClearSearch = () => {
    setSearchQuery('');
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Categories */}
        <div className="sticky top-0 bg-gray-50 z-10 pb-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4">
            {categories.map(({ id, name, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedCategory(id);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`category-icon flex-shrink-0 ${color} ${
                  selectedCategory === id && !searchQuery ? 'active' : ''
                }`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium whitespace-nowrap">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No items found</p>
            </div>
          ) : (
            filteredItems.map(item => (
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
            ))
          )}
        </div>
      </div>

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