import { Product } from '@/types';

export const products: Product[] = [
  // Fruits & Vegetables
  { id: 'p1', name: 'Onion', category: 'Fruits & Vegetables', price: 15, unit: '500g', emoji: '🧅', imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=300&fit=crop', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'], trending: true },
  { id: 'p1b', name: 'Onion', category: 'Fruits & Vegetables', price: 25, unit: '1kg', emoji: '🧅', imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=300&fit=crop', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p2', name: 'Tomato', category: 'Fruits & Vegetables', price: 18, unit: '500g', emoji: '🍅', imageUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&h=300&fit=crop', color: '#FF4444', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'], trending: true },
  { id: 'p2b', name: 'Tomato', category: 'Fruits & Vegetables', price: 30, unit: '1kg', emoji: '🍅', imageUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&h=300&fit=crop', color: '#FF4444', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p3', name: 'Potato', category: 'Fruits & Vegetables', price: 12, unit: '500g', emoji: '🥔', imageUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=300&h=300&fit=crop', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'], trending: true },
  { id: 'p3b', name: 'Potato', category: 'Fruits & Vegetables', price: 20, unit: '1kg', emoji: '🥔', imageUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=300&h=300&fit=crop', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p4', name: 'Banana', category: 'Fruits & Vegetables', price: 40, unit: '6pcs', emoji: '🍌', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop', color: '#FFE135', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'], trending: true },
  { id: 'p4b', name: 'Banana', category: 'Fruits & Vegetables', price: 70, unit: '12pcs', emoji: '🍌', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop', color: '#FFE135', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p5', name: 'Apple', category: 'Fruits & Vegetables', price: 65, unit: '500g', emoji: '🍎', imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=300&h=300&fit=crop', color: '#FF0000', stockStatus: 'in_stock', brand: 'Kashmir Valley', allergens: [], tags: ['fruit'], trending: true },
  { id: 'p5b', name: 'Apple', category: 'Fruits & Vegetables', price: 120, unit: '1kg', emoji: '🍎', imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=300&h=300&fit=crop', color: '#FF0000', stockStatus: 'in_stock', brand: 'Kashmir Valley', allergens: [], tags: ['fruit'] },
  { id: 'p6', name: 'Spinach', category: 'Fruits & Vegetables', price: 15, unit: 'bunch', emoji: '🥬', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', color: '#2E7D32', stockStatus: 'low_stock', brand: 'Green Leaf', allergens: [], tags: ['vegetable', 'green'], trending: true },
  { id: 'p7', name: 'Capsicum', category: 'Fruits & Vegetables', price: 22, unit: '500g', emoji: '🫑', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop', color: '#4CAF50', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'], trending: true },
  { id: 'p7b', name: 'Capsicum', category: 'Fruits & Vegetables', price: 40, unit: '1kg', emoji: '🫑', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop', color: '#4CAF50', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },

  // Dairy
  { id: 'p8', name: 'Amul Milk', category: 'Dairy', price: 28, unit: '500ml', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'staple'], trending: true },
  { id: 'p8b', name: 'Amul Milk', category: 'Dairy', price: 56, unit: '1L', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'staple'] },
  { id: 'p9', name: 'Amul Dahi', category: 'Dairy', price: 40, unit: '400g', emoji: '🫗', imageUrl: 'https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'], trending: true },
  { id: 'p10', name: 'Dairy Milk', category: 'Dairy', price: 30, unit: '500ml', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', color: '#E8E8E8', stockStatus: 'in_stock', brand: 'Mother Dairy', allergens: ['Dairy'], tags: ['dairy', 'staple'] },
  { id: 'p11', name: 'Amul Paneer', category: 'Dairy', price: 85, unit: '200g', emoji: '🧀', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'protein'], trending: true },
  { id: 'p12', name: 'Amul Butter', category: 'Dairy', price: 52, unit: '100g', emoji: '🧈', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'], trending: true },
  { id: 'p13', name: 'Fresh Cream', category: 'Dairy', price: 35, unit: '200ml', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1587657682223-f8bf8cee82ba?w=300&h=300&fit=crop', color: '#FFF8E1', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },

  // Staples
  { id: 'p14', name: 'Rice', category: 'Staples', price: 55, unit: '1kg', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'India Gate', allergens: [], tags: ['staple', 'grain'], trending: true },
  { id: 'p14b', name: 'Rice', category: 'Staples', price: 225, unit: '5kg', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'India Gate', allergens: [], tags: ['staple', 'grain'] },
  { id: 'p15', name: 'Toor Dal', category: 'Staples', price: 65, unit: '500g', emoji: '🫘', imageUrl: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'], trending: true },
  { id: 'p15b', name: 'Toor Dal', category: 'Staples', price: 120, unit: '1kg', emoji: '🫘', imageUrl: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'] },
  { id: 'p16', name: 'Wheat Flour', category: 'Staples', price: 50, unit: '1kg', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', color: '#F5DEB3', stockStatus: 'in_stock', brand: 'Ashirvaad', allergens: ['Gluten'], tags: ['staple', 'grain'], trending: true },
  { id: 'p16b', name: 'Wheat Flour', category: 'Staples', price: 195, unit: '5kg', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', color: '#F5DEB3', stockStatus: 'in_stock', brand: 'Ashirvaad', allergens: ['Gluten'], tags: ['staple', 'grain'] },
  { id: 'p17', name: 'Sugar', category: 'Staples', price: 22, unit: '500g', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'], trending: true },
  { id: 'p17b', name: 'Sugar', category: 'Staples', price: 42, unit: '1kg', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'] },
  { id: 'p18', name: 'Cooking Oil', category: 'Staples', price: 85, unit: '500ml', emoji: '🫒', imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fortune', allergens: [], tags: ['staple', 'oil'], trending: true },
  { id: 'p18b', name: 'Cooking Oil', category: 'Staples', price: 165, unit: '1L', emoji: '🫒', imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fortune', allergens: [], tags: ['staple', 'oil'] },
  { id: 'p19', name: 'Salt', category: 'Staples', price: 10, unit: '500g', emoji: '🧂', imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'], trending: true },

  // Snacks
  { id: 'p20', name: 'Maggi Noodles', category: 'Snacks', price: 14, unit: 'packet', emoji: '🍜', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop', color: '#FF6600', stockStatus: 'in_stock', brand: 'Maggi', allergens: ['Gluten'], tags: ['snack', 'instant'], trending: true },
  { id: 'p21', name: 'Lays Classic Chips', category: 'Snacks', price: 20, unit: 'packet', emoji: '🥨', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Lays', allergens: [], tags: ['snack', 'chips'], trending: true },
  { id: 'p22', name: 'Parle-G Biscuits', category: 'Snacks', price: 30, unit: '200g', emoji: '🍪', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Parle', allergens: ['Gluten'], tags: ['snack', 'biscuit'], trending: true },
  { id: 'p23', name: 'Haldiram Namkeen', category: 'Snacks', price: 45, unit: '200g', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#FF6347', stockStatus: 'in_stock', brand: 'Haldiram', allergens: ['Peanuts'], tags: ['snack', 'savory'], trending: true },

  // Beverages
  { id: 'p24', name: 'Cold Coffee', category: 'Beverages', price: 30, unit: '200ml', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', color: '#6F4E37', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['beverage', 'cold'], trending: true },
  { id: 'p25', name: 'Coca-Cola', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop', color: '#FF0000', stockStatus: 'in_stock', brand: 'Coca-Cola', allergens: [], tags: ['beverage', 'cold'], trending: true },
  { id: 'p26', name: 'Sprite', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop', color: '#00AA00', stockStatus: 'in_stock', brand: 'Sprite', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p27', name: 'Mango Juice', category: 'Beverages', price: 50, unit: '500ml', emoji: '🥭', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop', color: '#FFA500', stockStatus: 'in_stock', brand: 'Real', allergens: [], tags: ['beverage', 'juice'], trending: true },
  { id: 'p28', name: 'Green Tea', category: 'Beverages', price: 125, unit: '25bags', emoji: '🍵', imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop', color: '#90EE90', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'] },
  { id: 'p29', name: 'Chai Masala', category: 'Beverages', price: 45, unit: '100g', emoji: '🧉', imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'], trending: true },

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
  { id: 'p41', name: 'Chicken', category: 'Staples', price: 140, unit: '500g', emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&h=300&fit=crop', color: '#FFB6C1', stockStatus: 'in_stock', brand: 'Fresh Meat', allergens: [], tags: ['meat', 'protein', 'non-veg'], trending: true },
  { id: 'p42', name: 'Eggs', category: 'Dairy', price: 36, unit: '6pk', emoji: '🥚', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Farm Fresh', allergens: ['Egg'], tags: ['protein', 'eggs'], trending: true },
  { id: 'p43', name: 'Peanut Butter', category: 'Snacks', price: 180, unit: '250g', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1612187230809-97e3cf4e42e8?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Myfitness', allergens: ['Peanuts'], tags: ['snack', 'protein'], trending: true },
  { id: 'p44', name: 'Corn Flakes', category: 'Snacks', price: 140, unit: '500g', emoji: '🥣', imageUrl: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Kellogg\'s', allergens: ['Gluten'], tags: ['breakfast'], trending: true },

  // ─── More Fruits & Vegetables ───
  { id: 'p45', name: 'Carrot', category: 'Fruits & Vegetables', price: 30, unit: 'kg', emoji: '🥕', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop', color: '#FF8C00', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },
  { id: 'p46', name: 'Cucumber', category: 'Fruits & Vegetables', price: 20, unit: 'kg', emoji: '🥒', imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop', color: '#2E8B57', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable', 'salad'] },
  { id: 'p47', name: 'Lemon', category: 'Fruits & Vegetables', price: 60, unit: 'kg', emoji: '🍋', imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit', 'citrus'] },
  { id: 'p48', name: 'Ginger 100g', category: 'Fruits & Vegetables', price: 15, unit: '100g', emoji: '🫚', imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop', color: '#DEB887', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['spice', 'vegetable'] },
  { id: 'p49', name: 'Garlic 200g', category: 'Fruits & Vegetables', price: 25, unit: '200g', emoji: '🧄', imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2571?w=300&h=300&fit=crop', color: '#F5F5DC', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['spice', 'vegetable'] },
  { id: 'p50', name: 'Green Chilli 100g', category: 'Fruits & Vegetables', price: 10, unit: '100g', emoji: '🌶️', imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=300&h=300&fit=crop', color: '#228B22', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['spice', 'vegetable'] },
  { id: 'p51', name: 'Coriander Bunch', category: 'Fruits & Vegetables', price: 10, unit: 'bunch', emoji: '🌿', imageUrl: 'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=300&h=300&fit=crop', color: '#32CD32', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['herb', 'vegetable'] },
  { id: 'p52', name: 'Mint Bunch', category: 'Fruits & Vegetables', price: 10, unit: 'bunch', emoji: '🌱', imageUrl: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&h=300&fit=crop', color: '#00FA9A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['herb', 'vegetable'] },
  { id: 'p53', name: 'Mango', category: 'Fruits & Vegetables', price: 80, unit: 'kg', emoji: '🥭', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit', 'seasonal'] },
  { id: 'p54', name: 'Orange', category: 'Fruits & Vegetables', price: 60, unit: 'kg', emoji: '🍊', imageUrl: 'https://images.unsplash.com/photo-1547514701-42fee1e4c430?w=300&h=300&fit=crop', color: '#FFA500', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit', 'citrus'] },
  { id: 'p55', name: 'Grapes', category: 'Fruits & Vegetables', price: 70, unit: 'kg', emoji: '🍇', imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&h=300&fit=crop', color: '#800080', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p56', name: 'Watermelon', category: 'Fruits & Vegetables', price: 25, unit: 'kg', emoji: '🍉', imageUrl: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300&h=300&fit=crop', color: '#FF6347', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit', 'seasonal'] },
  { id: 'p57', name: 'Pomegranate', category: 'Fruits & Vegetables', price: 100, unit: 'kg', emoji: '🫐', imageUrl: 'https://images.unsplash.com/photo-1615485020866-0e1f3e5e0671?w=300&h=300&fit=crop', color: '#DC143C', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p58', name: 'Cauliflower', category: 'Fruits & Vegetables', price: 30, unit: 'piece', emoji: '🥦', imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop', color: '#F5F5DC', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },
  { id: 'p59', name: 'Brinjal', category: 'Fruits & Vegetables', price: 25, unit: 'kg', emoji: '🍆', imageUrl: 'https://images.unsplash.com/photo-1613881553903-4f0e5e383e27?w=300&h=300&fit=crop', color: '#4B0082', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },
  { id: 'p60', name: 'Beetroot', category: 'Fruits & Vegetables', price: 35, unit: 'kg', emoji: '🫒', imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=300&h=300&fit=crop', color: '#8B0000', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },
  { id: 'p61', name: 'Sweet Potato', category: 'Fruits & Vegetables', price: 30, unit: 'kg', emoji: '🍠', imageUrl: 'https://images.unsplash.com/photo-1596097635092-6e7e2e5e8e4c?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },
  { id: 'p62', name: 'Papaya', category: 'Fruits & Vegetables', price: 40, unit: 'kg', emoji: '🍈', imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=300&h=300&fit=crop', color: '#FF8C00', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p63', name: 'Pineapple', category: 'Fruits & Vegetables', price: 50, unit: 'piece', emoji: '🍍', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p64', name: 'Mushroom 200g', category: 'Fruits & Vegetables', price: 45, unit: '200g', emoji: '🍄', imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=300&h=300&fit=crop', color: '#D2B48C', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },

  // ─── More Dairy ───
  { id: 'p65', name: 'Cheese Slices 200g', category: 'Dairy', price: 110, unit: '200g', emoji: '🧀', imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'cheese'] },
  { id: 'p66', name: 'Flavoured Yogurt 200g', category: 'Dairy', price: 30, unit: '200g', emoji: '🍓', imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=300&h=300&fit=crop', color: '#FF69B4', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'snack'] },
  { id: 'p67', name: 'Ghee 500ml', category: 'Dairy', price: 280, unit: '500ml', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'cooking'] },
  { id: 'p68', name: 'Buttermilk 200ml', category: 'Dairy', price: 20, unit: '200ml', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1587657682223-f8bf8cee82ba?w=300&h=300&fit=crop', color: '#F5F5DC', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'beverage'] },
  { id: 'p69', name: 'Condensed Milk 200g', category: 'Dairy', price: 65, unit: '200g', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Milkmaid', allergens: ['Dairy'], tags: ['dairy', 'dessert'] },

  // ─── More Staples & Grains ───
  { id: 'p70', name: 'Moong Dal 1kg', category: 'Staples', price: 110, unit: 'kg', emoji: '🫘', imageUrl: 'https://images.unsplash.com/photo-1585996839258-eebd0e7e1e06?w=300&h=300&fit=crop', color: '#DAA520', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'] },
  { id: 'p71', name: 'Chana Dal 1kg', category: 'Staples', price: 95, unit: 'kg', emoji: '🫘', imageUrl: 'https://images.unsplash.com/photo-1515543904787-4b19bef6a8f7?w=300&h=300&fit=crop', color: '#DAA520', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'] },
  { id: 'p72', name: 'Masoor Dal 1kg', category: 'Staples', price: 100, unit: 'kg', emoji: '🫘', imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&h=300&fit=crop', color: '#FF6347', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'] },
  { id: 'p73', name: 'Basmati Rice 1kg', category: 'Staples', price: 95, unit: 'kg', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=300&h=300&fit=crop', color: '#FFFFF0', stockStatus: 'in_stock', brand: 'India Gate', allergens: [], tags: ['staple', 'grain'] },
  { id: 'p74', name: 'Poha 500g', category: 'Staples', price: 35, unit: '500g', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44726?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['staple', 'breakfast'] },
  { id: 'p75', name: 'Rava (Sooji) 500g', category: 'Staples', price: 30, unit: '500g', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Local', allergens: ['Gluten'], tags: ['staple', 'breakfast'] },
  { id: 'p76', name: 'Besan (Gram Flour) 500g', category: 'Staples', price: 55, unit: '500g', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', color: '#DAA520', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['staple'] },
  { id: 'p77', name: 'Maida 1kg', category: 'Staples', price: 40, unit: 'kg', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Ashirvaad', allergens: ['Gluten'], tags: ['staple'] },
  { id: 'p78', name: 'Jaggery 500g', category: 'Staples', price: 45, unit: '500g', emoji: '🟤', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['staple', 'sweetener'] },
  { id: 'p79', name: 'Honey 250g', category: 'Staples', price: 120, unit: '250g', emoji: '🍯', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Dabur', allergens: [], tags: ['staple', 'sweetener'] },

  // ─── More Spices & Condiments ───
  { id: 'p80', name: 'Cumin Seeds 100g', category: 'Staples', price: 40, unit: '100g', emoji: '🌿', imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },
  { id: 'p81', name: 'Mustard Seeds 100g', category: 'Staples', price: 25, unit: '100g', emoji: '🟡', imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&h=300&fit=crop', color: '#DAA520', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },
  { id: 'p82', name: 'Coriander Powder 100g', category: 'Staples', price: 30, unit: '100g', emoji: '🌿', imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300&h=300&fit=crop', color: '#8FBC8F', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },
  { id: 'p83', name: 'Black Pepper 50g', category: 'Staples', price: 45, unit: '50g', emoji: '⚫', imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300&h=300&fit=crop', color: '#000000', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },
  { id: 'p84', name: 'Tomato Ketchup 500g', category: 'Staples', price: 95, unit: '500g', emoji: '🍅', imageUrl: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=300&h=300&fit=crop', color: '#FF0000', stockStatus: 'in_stock', brand: 'Kissan', allergens: [], tags: ['condiment', 'sauce'] },
  { id: 'p85', name: 'Soy Sauce 200ml', category: 'Staples', price: 55, unit: '200ml', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Ching\'s', allergens: ['Soy'], tags: ['condiment', 'sauce'] },
  { id: 'p86', name: 'Vinegar 200ml', category: 'Staples', price: 30, unit: '200ml', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop', color: '#F5F5DC', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['condiment'] },
  { id: 'p87', name: 'Pickle 300g', category: 'Staples', price: 60, unit: '300g', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1589135233373-ab9f3b4200b5?w=300&h=300&fit=crop', color: '#FF4500', stockStatus: 'in_stock', brand: 'Mother\'s Recipe', allergens: [], tags: ['condiment'] },
  { id: 'p88', name: 'Papad Pack', category: 'Staples', price: 40, unit: '200g', emoji: '🫓', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Lijjat', allergens: [], tags: ['snack', 'staple'] },

  // ─── More Snacks ───
  { id: 'p89', name: 'Kurkure 100g', category: 'Snacks', price: 20, unit: '100g', emoji: '🟠', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop', color: '#FF8C00', stockStatus: 'in_stock', brand: 'Kurkure', allergens: [], tags: ['snack'] },
  { id: 'p90', name: 'Oreo Biscuits 120g', category: 'Snacks', price: 30, unit: '120g', emoji: '🍪', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', color: '#1C1C1C', stockStatus: 'in_stock', brand: 'Cadbury', allergens: ['Gluten', 'Dairy'], tags: ['snack', 'biscuit'] },
  { id: 'p91', name: 'Bourbon Biscuits', category: 'Snacks', price: 25, unit: '150g', emoji: '🍪', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', color: '#3C1414', stockStatus: 'in_stock', brand: 'Britannia', allergens: ['Gluten', 'Dairy'], tags: ['snack', 'biscuit'] },
  { id: 'p92', name: 'Popcorn 100g', category: 'Snacks', price: 40, unit: '100g', emoji: '🍿', imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Act II', allergens: [], tags: ['snack'] },
  { id: 'p93', name: 'Mixture 200g', category: 'Snacks', price: 50, unit: '200g', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Haldiram', allergens: ['Peanuts'], tags: ['snack', 'savory'] },
  { id: 'p94', name: 'Rusk 300g', category: 'Snacks', price: 35, unit: '300g', emoji: '🍞', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Britannia', allergens: ['Gluten'], tags: ['snack', 'breakfast'] },
  { id: 'p95', name: 'Bread Loaf', category: 'Snacks', price: 35, unit: 'loaf', emoji: '🍞', imageUrl: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Britannia', allergens: ['Gluten'], tags: ['bread', 'breakfast'] },
  { id: 'p96', name: 'Cream Roll Pack', category: 'Snacks', price: 30, unit: '4pk', emoji: '🧁', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Britannia', allergens: ['Gluten', 'Dairy'], tags: ['snack', 'bakery'] },
  { id: 'p97', name: 'Dark Chocolate 100g', category: 'Snacks', price: 90, unit: '100g', emoji: '🍫', imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop', color: '#3C1414', stockStatus: 'in_stock', brand: 'Cadbury', allergens: ['Dairy'], tags: ['snack', 'chocolate'] },
  { id: 'p98', name: 'Dairy Milk Chocolate', category: 'Snacks', price: 50, unit: '50g', emoji: '🍫', imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop', color: '#4B0082', stockStatus: 'in_stock', brand: 'Cadbury', allergens: ['Dairy'], tags: ['snack', 'chocolate'] },
  { id: 'p99', name: 'Muesli 500g', category: 'Snacks', price: 200, unit: '500g', emoji: '🥣', imageUrl: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&h=300&fit=crop', color: '#D2691E', stockStatus: 'in_stock', brand: 'Yogabar', allergens: ['Gluten'], tags: ['breakfast', 'healthy'] },
  { id: 'p100', name: 'Oats 1kg', category: 'Snacks', price: 130, unit: 'kg', emoji: '🥣', imageUrl: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&h=300&fit=crop', color: '#DEB887', stockStatus: 'in_stock', brand: 'Quaker', allergens: ['Gluten'], tags: ['breakfast', 'healthy'] },

  // ─── More Beverages ───
  { id: 'p101', name: 'Tata Tea 500g', category: 'Beverages', price: 195, unit: '500g', emoji: '🍵', imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'] },
  { id: 'p102', name: 'Nescafe Coffee 50g', category: 'Beverages', price: 140, unit: '50g', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', color: '#3C1414', stockStatus: 'in_stock', brand: 'Nescafe', allergens: [], tags: ['beverage', 'coffee'] },
  { id: 'p103', name: 'Bournvita 500g', category: 'Beverages', price: 210, unit: '500g', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', color: '#3C1414', stockStatus: 'in_stock', brand: 'Cadbury', allergens: ['Dairy'], tags: ['beverage', 'health drink'] },
  { id: 'p104', name: 'Frooti 600ml', category: 'Beverages', price: 30, unit: '600ml', emoji: '🧃', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Parle', allergens: [], tags: ['beverage', 'juice'] },
  { id: 'p105', name: 'Limca 750ml', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop', color: '#98FB98', stockStatus: 'in_stock', brand: 'Coca-Cola', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p106', name: 'Thumbs Up 750ml', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop', color: '#DC143C', stockStatus: 'in_stock', brand: 'Coca-Cola', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p107', name: 'Coconut Water 200ml', category: 'Beverages', price: 25, unit: '200ml', emoji: '🥥', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop', color: '#F5F5DC', stockStatus: 'in_stock', brand: 'Raw', allergens: [], tags: ['beverage', 'healthy'] },
  { id: 'p108', name: 'Lassi 200ml', category: 'Beverages', price: 25, unit: '200ml', emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', color: '#FFFFF0', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['beverage', 'dairy'] },
  { id: 'p109', name: 'Mineral Water 1L', category: 'Beverages', price: 20, unit: '1L', emoji: '💧', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=300&fit=crop', color: '#ADD8E6', stockStatus: 'in_stock', brand: 'Bisleri', allergens: [], tags: ['beverage', 'water'] },
  { id: 'p110', name: 'Soda 750ml', category: 'Beverages', price: 15, unit: '750ml', emoji: '🫧', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop', color: '#E0FFFF', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['beverage'] },

  // ─── More Personal Care ───
  { id: 'p111', name: 'Hair Oil 200ml', category: 'Personal Care', price: 95, unit: '200ml', emoji: '💆', imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop', color: '#228B22', stockStatus: 'in_stock', brand: 'Parachute', allergens: [], tags: ['personal', 'hair'] },
  { id: 'p112', name: 'Body Lotion 200ml', category: 'Personal Care', price: 140, unit: '200ml', emoji: '🧴', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#FFF0F5', stockStatus: 'in_stock', brand: 'Nivea', allergens: [], tags: ['personal', 'skin'] },
  { id: 'p113', name: 'Deodorant 150ml', category: 'Personal Care', price: 180, unit: '150ml', emoji: '🧴', imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop', color: '#4169E1', stockStatus: 'in_stock', brand: 'Nivea', allergens: [], tags: ['personal'] },
  { id: 'p114', name: 'Razor Pack', category: 'Personal Care', price: 60, unit: '5pk', emoji: '🪒', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#4682B4', stockStatus: 'in_stock', brand: 'Gillette', allergens: [], tags: ['personal', 'grooming'] },
  { id: 'p115', name: 'Sanitary Pads 8pk', category: 'Personal Care', price: 75, unit: '8pk', emoji: '🩹', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#FFB6C1', stockStatus: 'in_stock', brand: 'Whisper', allergens: [], tags: ['personal', 'hygiene'] },
  { id: 'p116', name: 'Hand Wash 250ml', category: 'Personal Care', price: 55, unit: '250ml', emoji: '🧼', imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop', color: '#ADD8E6', stockStatus: 'in_stock', brand: 'Dettol', allergens: [], tags: ['personal', 'hygiene'] },
  { id: 'p117', name: 'Tissue Box 100 pulls', category: 'Personal Care', price: 85, unit: 'box', emoji: '🧻', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Origami', allergens: [], tags: ['personal', 'hygiene'] },
  { id: 'p118', name: 'Mouthwash 250ml', category: 'Personal Care', price: 110, unit: '250ml', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop', color: '#00CED1', stockStatus: 'in_stock', brand: 'Listerine', allergens: [], tags: ['personal', 'oral'] },
  { id: 'p119', name: 'Sunscreen 50ml', category: 'Personal Care', price: 200, unit: '50ml', emoji: '☀️', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Lakme', allergens: [], tags: ['personal', 'skin'] },
  { id: 'p120', name: 'Cotton Buds 100pk', category: 'Personal Care', price: 30, unit: '100pk', emoji: '🏥', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Johnson', allergens: [], tags: ['personal', 'hygiene'] },

  // ─── More Household ───
  { id: 'p121', name: 'Garbage Bags 30pk', category: 'Household', price: 80, unit: '30pk', emoji: '🗑️', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#000000', stockStatus: 'in_stock', brand: 'Ezee', allergens: [], tags: ['household'] },
  { id: 'p122', name: 'Aluminium Foil 9m', category: 'Household', price: 70, unit: '9m', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#C0C0C0', stockStatus: 'in_stock', brand: 'Hindalco', allergens: [], tags: ['household', 'kitchen'] },
  { id: 'p123', name: 'Cling Wrap', category: 'Household', price: 60, unit: '30m', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#E0FFFF', stockStatus: 'in_stock', brand: 'Ezee', allergens: [], tags: ['household', 'kitchen'] },
  { id: 'p124', name: 'Scrubber Pack', category: 'Household', price: 25, unit: '3pk', emoji: '🧽', imageUrl: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=300&h=300&fit=crop', color: '#32CD32', stockStatus: 'in_stock', brand: 'Scotch Brite', allergens: [], tags: ['household', 'cleaning'] },
  { id: 'p125', name: 'Mosquito Repellent', category: 'Household', price: 55, unit: '45ml', emoji: '🦟', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#228B22', stockStatus: 'in_stock', brand: 'Good Knight', allergens: [], tags: ['household'] },
  { id: 'p126', name: 'Room Freshener', category: 'Household', price: 120, unit: '250ml', emoji: '🌸', imageUrl: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=300&fit=crop', color: '#DDA0DD', stockStatus: 'in_stock', brand: 'Odonil', allergens: [], tags: ['household'] },
  { id: 'p127', name: 'Batteries AA 4pk', category: 'Household', price: 80, unit: '4pk', emoji: '🔋', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Duracell', allergens: [], tags: ['household', 'electronics'] },
  { id: 'p128', name: 'Light Bulb LED', category: 'Household', price: 90, unit: 'piece', emoji: '💡', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Philips', allergens: [], tags: ['household', 'electronics'] },
  { id: 'p129', name: 'Matchbox 10pk', category: 'Household', price: 10, unit: '10pk', emoji: '🔥', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#FF4500', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['household'] },
  { id: 'p130', name: 'Paper Napkins 100pk', category: 'Household', price: 45, unit: '100pk', emoji: '🧻', imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Origami', allergens: [], tags: ['household'] },

  // ─── Instant & Ready-to-eat ───
  { id: 'p131', name: 'Cup Noodles', category: 'Snacks', price: 45, unit: 'cup', emoji: '🍜', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop', color: '#FF6600', stockStatus: 'in_stock', brand: 'Nissin', allergens: ['Gluten'], tags: ['snack', 'instant'] },
  { id: 'p132', name: 'Instant Pasta', category: 'Snacks', price: 35, unit: 'packet', emoji: '🍝', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Knorr', allergens: ['Gluten'], tags: ['snack', 'instant'] },
  { id: 'p133', name: 'Instant Soup 4pk', category: 'Snacks', price: 55, unit: '4pk', emoji: '🍲', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop', color: '#FF6347', stockStatus: 'in_stock', brand: 'Knorr', allergens: [], tags: ['snack', 'instant'] },
  { id: 'p134', name: 'Ready Biryani Mix', category: 'Staples', price: 75, unit: '50g', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#FF8C00', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice', 'mix'] },
  { id: 'p135', name: 'Pav Bhaji Masala 50g', category: 'Staples', price: 35, unit: '50g', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#FF4500', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice', 'mix'] },
  { id: 'p136', name: 'Sambar Powder 100g', category: 'Staples', price: 40, unit: '100g', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#B22222', stockStatus: 'in_stock', brand: 'MTR', allergens: [], tags: ['spice', 'south indian'] },
  { id: 'p137', name: 'Dosa Mix 200g', category: 'Staples', price: 45, unit: '200g', emoji: '🫓', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'MTR', allergens: [], tags: ['instant', 'south indian'] },
  { id: 'p138', name: 'Idli Mix 200g', category: 'Staples', price: 40, unit: '200g', emoji: '🫓', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'MTR', allergens: [], tags: ['instant', 'south indian'] },
  { id: 'p139', name: 'Upma Mix 200g', category: 'Staples', price: 40, unit: '200g', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'MTR', allergens: [], tags: ['instant', 'south indian'] },

  // ─── Baby & Health ───
  { id: 'p140', name: 'Diapers Small 10pk', category: 'Personal Care', price: 200, unit: '10pk', emoji: '👶', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#ADD8E6', stockStatus: 'in_stock', brand: 'Pampers', allergens: [], tags: ['baby', 'hygiene'] },
  { id: 'p141', name: 'Baby Wipes 72pk', category: 'Personal Care', price: 120, unit: '72pk', emoji: '👶', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#E0FFFF', stockStatus: 'in_stock', brand: 'MamyPoko', allergens: [], tags: ['baby', 'hygiene'] },
  { id: 'p142', name: 'Band-Aid 10pk', category: 'Personal Care', price: 30, unit: '10pk', emoji: '🩹', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#F5DEB3', stockStatus: 'in_stock', brand: 'Band-Aid', allergens: [], tags: ['health'] },
  { id: 'p143', name: 'ORS Sachets 5pk', category: 'Personal Care', price: 25, unit: '5pk', emoji: '💊', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', color: '#FFA07A', stockStatus: 'in_stock', brand: 'Electral', allergens: [], tags: ['health'] },
  { id: 'p144', name: 'Protein Bar 60g', category: 'Snacks', price: 80, unit: '60g', emoji: '💪', imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'RiteBite', allergens: ['Peanuts'], tags: ['snack', 'healthy', 'protein'] },
  { id: 'p145', name: 'Almonds 200g', category: 'Snacks', price: 220, unit: '200g', emoji: '🌰', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#DEB887', stockStatus: 'in_stock', brand: 'Happilo', allergens: ['Tree Nuts'], tags: ['dry fruit', 'healthy'] },
  { id: 'p146', name: 'Cashews 200g', category: 'Snacks', price: 250, unit: '200g', emoji: '🌰', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#FAFAD2', stockStatus: 'in_stock', brand: 'Happilo', allergens: ['Tree Nuts'], tags: ['dry fruit', 'healthy'] },
  { id: 'p147', name: 'Raisins 200g', category: 'Snacks', price: 80, unit: '200g', emoji: '🍇', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#4B0082', stockStatus: 'in_stock', brand: 'Happilo', allergens: [], tags: ['dry fruit', 'healthy'] },
  { id: 'p148', name: 'Dates 250g', category: 'Snacks', price: 100, unit: '250g', emoji: '🫒', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Happilo', allergens: [], tags: ['dry fruit', 'healthy'] },

  // ─── Frozen & Misc ───
  { id: 'p149', name: 'Frozen Peas 500g', category: 'Fruits & Vegetables', price: 55, unit: '500g', emoji: '🟢', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', color: '#32CD32', stockStatus: 'in_stock', brand: 'Safal', allergens: [], tags: ['frozen', 'vegetable'] },
  { id: 'p150', name: 'Frozen Corn 500g', category: 'Fruits & Vegetables', price: 60, unit: '500g', emoji: '🌽', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', color: '#FFD700', stockStatus: 'in_stock', brand: 'Safal', allergens: [], tags: ['frozen', 'vegetable'] },
  { id: 'p151', name: 'Ice Cream 500ml', category: 'Dairy', price: 120, unit: '500ml', emoji: '🍦', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['frozen', 'dessert'] },
  { id: 'p152', name: 'Coconut 1pc', category: 'Fruits & Vegetables', price: 25, unit: 'piece', emoji: '🥥', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Fresh', allergens: [], tags: ['vegetable'] },
  { id: 'p153', name: 'Tamarind 200g', category: 'Staples', price: 30, unit: '200g', emoji: '🟤', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#8B4513', stockStatus: 'in_stock', brand: 'Local', allergens: [], tags: ['spice', 'south indian'] },
  { id: 'p154', name: 'Paneer Tikka Masala', category: 'Staples', price: 45, unit: '50g', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#FF4500', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice', 'mix'] },
  { id: 'p155', name: 'Chaat Masala 50g', category: 'Staples', price: 25, unit: '50g', emoji: '🧂', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', color: '#FF6347', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },
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
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  // Common voice aliases (Hindi/colloquial → product name keywords)
  const aliases: Record<string, string[]> = {
    'atta': ['wheat flour'],
    'aata': ['wheat flour'],
    'dahi': ['dahi', 'yogurt'],
    'curd': ['dahi', 'yogurt'],
    'chawal': ['rice'],
    'chaawal': ['rice'],
    'aloo': ['potato'],
    'pyaaz': ['onion'],
    'pyaz': ['onion'],
    'tamatar': ['tomato'],
    'doodh': ['milk'],
    'dudh': ['milk'],
    'makhan': ['butter'],
    'namak': ['salt'],
    'cheeni': ['sugar'],
    'shakkar': ['sugar'],
    'tel': ['oil', 'cooking oil'],
    'mirch': ['chilli'],
    'mirchi': ['chilli'],
    'haldi': ['turmeric'],
    'jeera': ['cumin'],
    'rai': ['mustard'],
    'anda': ['eggs'],
    'ande': ['eggs'],
    'murgi': ['chicken'],
    'murghi': ['chicken'],
    'bread': ['bread'],
    'roti': ['wheat flour'],
    'chapati': ['wheat flour'],
    'noodles': ['maggi', 'noodles'],
    'chips': ['lays', 'chips'],
    'biscuit': ['parle', 'biscuit'],
    'biscuits': ['parle', 'biscuit'],
    'juice': ['juice', 'mango juice'],
    'coffee': ['coffee', 'nescafe'],
    'chai': ['tea', 'chai masala'],
    'shampoo': ['shampoo'],
    'sabun': ['soap'],
    'detergent': ['detergent'],
  };

  // Expand query with aliases
  let expandedWords = [...words];
  for (const w of words) {
    if (aliases[w]) {
      expandedWords = [...expandedWords, ...aliases[w].flatMap(a => a.split(' '))];
    }
  }

  let best: Product | undefined;
  let bestScore = 0;

  for (const p of products) {
    let score = 0;
    const name = p.name.toLowerCase();

    // Exact name match gets highest score
    if (name === q) { score += 100; }
    // Name starts with query
    else if (name.startsWith(q)) { score += 50; }

    for (const w of expandedWords) {
      if (w.length < 2) continue;
      if (name === w) score += 25;
      else if (name.includes(w)) score += 10;
      if (p.tags.some(t => t.includes(w))) score += 5;
      if (p.brand.toLowerCase().includes(w)) score += 3;
      if (p.category.toLowerCase().includes(w)) score += 2;
    }

    // Prefer trending (default size) products over bulk variants
    if (p.trending && score > 0) score += 2;

    // Fuzzy: handle common misspellings (off by 1 character)
    if (score === 0 && q.length > 3) {
      const nameWords = name.split(/\s+/);
      for (const nw of nameWords) {
        if (nw.length > 3 && Math.abs(nw.length - q.length) <= 2) {
          let matches = 0;
          for (let i = 0; i < Math.min(nw.length, q.length); i++) {
            if (nw[i] === q[i]) matches++;
          }
          if (matches / Math.max(nw.length, q.length) > 0.7) {
            score += 8;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}
