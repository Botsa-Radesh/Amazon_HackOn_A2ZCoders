import { Product } from '@/types';

export const products: Product[] = [
  // Fruits & Vegetables
  { id: 'p1', name: 'Onion', category: 'Fruits & Vegetables', price: 25, unit: 'kg', emoji: '🧅', imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=300&fit=crop', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p2', name: 'Tomato', category: 'Fruits & Vegetables', price: 30, unit: 'kg', emoji: '🍅', imageUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&h=300&fit=crop', color: '#FF4444', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p3', name: 'Potato', category: 'Fruits & Vegetables', price: 20, unit: 'kg', emoji: '🥔', imageUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=300&h=300&fit=crop', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p4', name: 'Banana', category: 'Fruits & Vegetables', price: 40, unit: 'dozen', emoji: '🍌', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop', color: '#FFE135', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p5', name: 'Apple', category: 'Fruits & Vegetables', price: 120, unit: 'kg', emoji: '🍎', imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=300&h=300&fit=crop', color: '#FF0000', stockStatus: 'in_stock', brand: 'Kashmir Valley', allergens: [], tags: ['fruit'] },
  { id: 'p6', name: 'Spinach', category: 'Fruits & Vegetables', price: 15, unit: 'bunch', emoji: '🥬', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', color: '#2E7D32', stockStatus: 'low_stock', brand: 'Green Leaf', allergens: [], tags: ['vegetable', 'green'] },
  { id: 'p7', name: 'Capsicum', category: 'Fruits & Vegetables', price: 40, unit: 'kg', emoji: '🫑', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop', color: '#4CAF50', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },

  // Dairy
  { id: 'p8', name: 'Amul Milk 1L', category: 'Dairy', price: 56, unit: 'L', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'staple'] },
  { id: 'p9', name: 'Amul Dahi 400g', category: 'Dairy', price: 40, unit: '400g', emoji: '🫗', imageUrl: 'https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },
  { id: 'p10', name: 'Dairy Milk 1L', category: 'Dairy', price: 58, unit: 'L', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', color: '#E8E8E8', stockStatus: 'in_stock', brand: 'Mother Dairy', allergens: ['Dairy'], tags: ['dairy', 'staple'] },
  { id: 'p11', name: 'Amul Paneer 200g', category: 'Dairy', price: 85, unit: '200g', emoji: '🧀', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'protein'] },
  { id: 'p12', name: 'Amul Butter 100g', category: 'Dairy', price: 52, unit: '100g', emoji: '🧈', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },
  { id: 'p13', name: 'Fresh Cream 200ml', category: 'Dairy', price: 65, unit: '200ml', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1587657682223-f8bf8cee82ba?w=300&h=300&fit=crop', color: '#FFF8E1', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },

  // Staples
  { id: 'p14', name: 'Rice 5kg', category: 'Staples', price: 225, unit: '5kg', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'India Gate', allergens: [], tags: ['staple', 'grain'] },
  { id: 'p15', name: 'Toor Dal 1kg', category: 'Staples', price: 120, unit: 'kg', emoji: '🫘', imageUrl: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'] },
  { id: 'p16', name: 'Wheat Flour 5kg', category: 'Staples', price: 195, unit: '5kg', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', color: '#F5DEB3', stockStatus: 'in_stock', brand: 'Ashirvaad', allergens: ['Gluten'], tags: ['staple', 'grain'] },
  { id: 'p17', name: 'Sugar 1kg', category: 'Staples', price: 42, unit: 'kg', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'] },
  { id: 'p18', name: 'Cooking Oil 1L', category: 'Staples', price: 165, unit: 'L', emoji: '🫒', imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fortune', allergens: [], tags: ['staple', 'oil'] },
  { id: 'p19', name: 'Salt 1kg', category: 'Staples', price: 18, unit: 'kg', emoji: '🧂', imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'] },

  // Snacks
  { id: 'p20', name: 'Maggi Noodles 12pk', category: 'Snacks', price: 144, unit: '12pk', emoji: '🍜', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop', color: '#FF6600', stockStatus: 'in_stock', brand: 'Maggi', allergens: ['Gluten'], tags: ['snack', 'instant'] },
  { id: 'p21', name: 'Lays Classic Chips', category: 'Snacks', price: 20, unit: 'packet', emoji: '🥨', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Lays', allergens: [], tags: ['snack', 'chips'] },
  { id: 'p22', name: 'Parle-G Biscuits', category: 'Snacks', price: 30, unit: '200g', emoji: '🍪', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Parle', allergens: ['Gluten'], tags: ['snack', 'biscuit'] },
  { id: 'p23', name: 'Haldiram Namkeen', category: 'Snacks', price: 45, unit: '200g', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#FF6347', stockStatus: 'in_stock', brand: 'Haldiram', allergens: ['Peanuts'], tags: ['snack', 'savory'] },

  // Beverages
  { id: 'p24', name: 'Cold Coffee 200ml', category: 'Beverages', price: 60, unit: '200ml', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', color: '#6F4E37', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['beverage', 'cold'] },
  { id: 'p25', name: 'Coca-Cola 750ml', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop', color: '#FF0000', stockStatus: 'in_stock', brand: 'Coca-Cola', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p26', name: 'Sprite 750ml', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop', color: '#00AA00', stockStatus: 'in_stock', brand: 'Sprite', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p27', name: 'Mango Juice 1L', category: 'Beverages', price: 95, unit: 'L', emoji: '🥭', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop', color: '#FFA500', stockStatus: 'in_stock', brand: 'Real', allergens: [], tags: ['beverage', 'juice'] },
  { id: 'p28', name: 'Green Tea 25 bags', category: 'Beverages', price: 125, unit: '25bags', emoji: '🍵', imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop', color: '#90EE90', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'] },
  { id: 'p29', name: 'Chai Masala 100g', category: 'Beverages', price: 45, unit: '100g', emoji: '🧉', imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'] },

  // Personal Care
  { id: 'p30', name: 'Shampoo 200ml', category: 'Personal Care', price: 180, unit: '200ml', emoji: '🧴', imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop', color: '#FF69B4', stockStatus: 'in_stock', brand: 'Dove', allergens: [], tags: ['personal'] },
  { id: 'p31', name: 'Face Wash 100g', category: 'Personal Care', price: 85, unit: '100g', emoji: '🧼', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#00BFFF', stockStatus: 'in_stock', brand: 'Himalaya', allergens: [], tags: ['personal'] },
  { id: 'p32', name: 'Bath Soap 3pk', category: 'Personal Care', price: 75, unit: '3pk', emoji: '🫧', imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Dove', allergens: [], tags: ['personal'] },
  { id: 'p33', name: 'Toothpaste 100g', category: 'Personal Care', price: 95, unit: '100g', emoji: '🪥', imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop', color: '#00BFFF', stockStatus: 'in_stock', brand: 'Colgate', allergens: [], tags: ['personal'] },

  // Household
  { id: 'p34', name: 'Detergent 1kg', category: 'Household', price: 150, unit: 'kg', emoji: '🧺', imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop', color: '#4169E1', stockStatus: 'in_stock', brand: 'Surf Excel', allergens: [], tags: ['household', 'laundry'] },
  { id: 'p35', name: 'Floor Cleaner 1L', category: 'Household', price: 95, unit: 'L', emoji: '🧹', imageUrl: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=300&fit=crop', color: '#00FF7F', stockStatus: 'in_stock', brand: 'Lizol', allergens: [], tags: ['household', 'cleaning'] },
  { id: 'p36', name: 'Dishwash Liquid 500ml', category: 'Household', price: 80, unit: '500ml', emoji: '🍽️', imageUrl: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Vim', allergens: [], tags: ['household', 'cleaning'] },
  { id: 'p37', name: 'Toilet Cleaner 500ml', category: 'Household', price: 85, unit: '500ml', emoji: '🚽', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#00BFFF', stockStatus: 'in_stock', brand: 'Harpic', allergens: [], tags: ['household', 'cleaning'] },

  // Spices
  { id: 'p38', name: 'Turmeric Powder 100g', category: 'Staples', price: 35, unit: '100g', emoji: '🧡', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop', color: '#FF8C00', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['spice'] },
  { id: 'p39', name: 'Red Chilli Powder 100g', category: 'Staples', price: 40, unit: '100g', emoji: '🌶️', imageUrl: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&h=300&fit=crop', color: '#DC143C', stockStatus: 'low_stock', brand: 'Tata Sampann', allergens: [], tags: ['spice'] },
  { id: 'p40', name: 'Garam Masala 50g', category: 'Staples', price: 30, unit: '50g', emoji: '🧂', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },

  // Protein / Meat
  { id: 'p41', name: 'Chicken 500g', category: 'Staples', price: 140, unit: '500g', emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&h=300&fit=crop', color: '#FFB6C1', stockStatus: 'in_stock', brand: 'Fresh Meat', allergens: [], tags: ['meat', 'protein', 'non-veg'] },
  { id: 'p42', name: 'Eggs 6pk', category: 'Dairy', price: 36, unit: '6pk', emoji: '🥚', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Farm Fresh', allergens: ['Egg'], tags: ['protein', 'eggs'] },
  { id: 'p43', name: 'Peanut Butter 250g', category: 'Snacks', price: 180, unit: '250g', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1612187230809-97e3cf4e42e8?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Myfitness', allergens: ['Peanuts'], tags: ['snack', 'protein'] },
  { id: 'p44', name: 'Corn Flakes 500g', category: 'Snacks', price: 140, unit: '500g', emoji: '🥣', imageUrl: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Kellogg\'s', allergens: ['Gluten'], tags: ['breakfast'] },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q))
  );
}

export function findBestMatch(query: string): Product | undefined {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);
  let best: Product | undefined;
  let bestScore = 0;
  for (const p of products) {
    let score = 0;
    const name = p.name.toLowerCase();
    for (const w of words) {
      if (w.length < 2) continue;
      if (name.includes(w)) score += 10;
      if (p.tags.some(t => t.includes(w))) score += 5;
      if (p.brand.toLowerCase().includes(w)) score += 3;
      if (p.category.toLowerCase().includes(w)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}
