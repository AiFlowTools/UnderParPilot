/*
  # Add Drinks items to menu_items table
  
  1. Changes
    - Insert new Drinks category items into menu_items table
    - Add high-quality beverage images from Unsplash
    - Include variety of non-alcoholic and specialty drinks
*/

INSERT INTO menu_items (golf_course_id, category, item_name, description, price, image_url)
VALUES 
  (
    'c4a48f69-a535-4f57-8716-d34cff63059b',
    'Drinks',
    'Fresh Lemonade',
    'House-made lemonade with fresh-squeezed lemons and a hint of mint',
    4.50,
    'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c4a48f69-a535-4f57-8716-d34cff63059b',
    'Drinks',
    'Iced Tea',
    'Classic freshly brewed iced tea, sweetened or unsweetened',
    3.50,
    'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c4a48f69-a535-4f57-8716-d34cff63059b',
    'Drinks',
    'Sparkling Water',
    'Premium sparkling mineral water',
    3.00,
    'https://images.unsplash.com/photo-1598343175492-9e7dc0e63cc6?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c4a48f69-a535-4f57-8716-d34cff63059b',
    'Drinks',
    'Sports Drink',
    'Electrolyte-enhanced beverage for hydration',
    4.00,
    'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c4a48f69-a535-4f57-8716-d34cff63059b',
    'Drinks',
    'Cold Brew Coffee',
    'Smooth, rich cold-brewed coffee served over ice',
    5.00,
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c4a48f69-a535-4f57-8716-d34cff63059b',
    'Drinks',
    'Fresh Fruit Smoothie',
    'Blend of seasonal fruits with yogurt or juice base',
    6.50,
    'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80'
  );