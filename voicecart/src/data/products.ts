import { Product } from '@/types';

export const products: Product[] = [
  // Fruits & Vegetables — Wikimedia / open food photos
  { id: 'p1', name: 'Onion', category: 'Fruits & Vegetables', price: 25, unit: 'kg', emoji: '🧅', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Onion_on_white_background.jpg/320px-Onion_on_white_background.jpg', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p2', name: 'Tomato', category: 'Fruits & Vegetables', price: 30, unit: 'kg', emoji: '🍅', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/320px-Tomato_je.jpg', color: '#FF4444', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p3', name: 'Potato', category: 'Fruits & Vegetables', price: 20, unit: 'kg', emoji: '🥔', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Potato_%28Solanum_tuberosum%29.jpg/320px-Potato_%28Solanum_tuberosum%29.jpg', color: '#C4A35A', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['staple', 'vegetable'] },
  { id: 'p4', name: 'Banana', category: 'Fruits & Vegetables', price: 40, unit: 'dozen', emoji: '🍌', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Platano.jpg/320px-Banana-Platano.jpg', color: '#FFE135', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['fruit'] },
  { id: 'p5', name: 'Apple', category: 'Fruits & Vegetables', price: 120, unit: 'kg', emoji: '🍎', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/320px-Red_Apple.jpg', color: '#FF0000', stockStatus: 'in_stock', brand: 'Kashmir Valley', allergens: [], tags: ['fruit'] },
  { id: 'p6', name: 'Spinach', category: 'Fruits & Vegetables', price: 15, unit: 'bunch', emoji: '🥬', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/sixty-seven/Fresh_bunches_of_spinach_at_a_farmers%27_market.jpg/320px-Fresh_bunches_of_spinach_at_a_farmers%27_market.jpg', color: '#2E7D32', stockStatus: 'low_stock', brand: 'Green Leaf', allergens: [], tags: ['vegetable', 'green'] },
  { id: 'p7', name: 'Capsicum', category: 'Fruits & Vegetables', price: 40, unit: 'kg', emoji: '🫑', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Green_capsicum_3.jpg/320px-Green_capsicum_3.jpg', color: '#4CAF50', stockStatus: 'in_stock', brand: 'Fresh Farms', allergens: [], tags: ['vegetable'] },

  // Dairy — Open Food Facts CDN (real Indian brand packs)
  { id: 'p8', name: 'Amul Milk 1L', category: 'Dairy', price: 56, unit: 'L', emoji: '🥛', imageUrl: 'https://images.openfoodfacts.org/images/products/890/111/001/1282/front_en.15.400.jpg', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'staple'] },
  { id: 'p9', name: 'Amul Dahi 400g', category: 'Dairy', price: 40, unit: '400g', emoji: '🫗', imageUrl: 'https://images.openfoodfacts.org/images/products/890/111/068/2000/front_en.5.400.jpg', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },
  { id: 'p10', name: 'Mother Dairy Milk 1L', category: 'Dairy', price: 58, unit: 'L', emoji: '🥛', imageUrl: 'https://images.openfoodfacts.org/images/products/890/300/008/6004/front_en.6.400.jpg', color: '#E8E8E8', stockStatus: 'in_stock', brand: 'Mother Dairy', allergens: ['Dairy'], tags: ['dairy', 'staple'] },
  { id: 'p11', name: 'Amul Paneer 200g', category: 'Dairy', price: 85, unit: '200g', emoji: '🧀', imageUrl: 'https://images.openfoodfacts.org/images/products/890/111/003/4000/front_en.12.400.jpg', color: '#FFFACD', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy', 'protein'] },
  { id: 'p12', name: 'Amul Butter 100g', category: 'Dairy', price: 52, unit: '100g', emoji: '🧈', imageUrl: 'https://images.openfoodfacts.org/images/products/890/111/002/5004/front_en.22.400.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },
  { id: 'p13', name: 'Fresh Cream 200ml', category: 'Dairy', price: 65, unit: '200ml', emoji: '🥛', imageUrl: 'https://images.openfoodfacts.org/images/products/890/111/006/3008/front_en.7.400.jpg', color: '#FFF8E1', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['dairy'] },

  // Staples
  { id: 'p14', name: 'Rice 5kg', category: 'Staples', price: 225, unit: '5kg', emoji: '🍚', imageUrl: 'https://images.openfoodfacts.org/images/products/890/121/062/2007/front_en.9.400.jpg', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'India Gate', allergens: [], tags: ['staple', 'grain'] },
  { id: 'p15', name: 'Toor Dal 1kg', category: 'Staples', price: 120, unit: 'kg', emoji: '🫘', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Toor_Dal.jpg/320px-Toor_Dal.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['staple', 'dal'] },
  { id: 'p16', name: 'Wheat Flour 5kg', category: 'Staples', price: 195, unit: '5kg', emoji: '🌾', imageUrl: 'https://images.openfoodfacts.org/images/products/890/116/520/3003/front_en.10.400.jpg', color: '#F5DEB3', stockStatus: 'in_stock', brand: 'Ashirvaad', allergens: ['Gluten'], tags: ['staple', 'grain'] },
  { id: 'p17', name: 'Sugar 1kg', category: 'Staples', price: 42, unit: 'kg', emoji: '🍚', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Cristal_azucar.jpg/320px-Cristal_azucar.jpg', color: '#FFFFFF', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'] },
  { id: 'p18', name: 'Cooking Oil 1L', category: 'Staples', price: 165, unit: 'L', emoji: '🫒', imageUrl: 'https://images.openfoodfacts.org/images/products/890/116/001/4002/front_en.9.400.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Fortune', allergens: [], tags: ['staple', 'oil'] },
  { id: 'p19', name: 'Salt 1kg', category: 'Staples', price: 18, unit: 'kg', emoji: '🧂', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Salt_shaker_on_white_background.jpg/320px-Salt_shaker_on_white_background.jpg', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['staple'] },

  // Snacks
  { id: 'p20', name: 'Maggi Noodles 12pk', category: 'Snacks', price: 144, unit: '12pk', emoji: '🍜', imageUrl: 'https://images.openfoodfacts.org/images/products/890/116/009/4003/front_en.20.400.jpg', color: '#FF6600', stockStatus: 'in_stock', brand: 'Maggi', allergens: ['Gluten'], tags: ['snack', 'instant'] },
  { id: 'p21', name: 'Lays Classic Chips', category: 'Snacks', price: 20, unit: 'packet', emoji: '🥨', imageUrl: 'https://images.openfoodfacts.org/images/products/028/400/589/7655/front_en.55.400.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Lays', allergens: [], tags: ['snack', 'chips'] },
  { id: 'p22', name: 'Parle-G Biscuits', category: 'Snacks', price: 30, unit: '200g', emoji: '🍪', imageUrl: 'https://images.openfoodfacts.org/images/products/890/114/001/1065/front_en.17.400.jpg', color: '#8B4513', stockStatus: 'in_stock', brand: 'Parle', allergens: ['Gluten'], tags: ['snack', 'biscuit'] },
  { id: 'p23', name: 'Haldiram Namkeen', category: 'Snacks', price: 45, unit: '200g', emoji: '🥜', imageUrl: 'https://images.openfoodfacts.org/images/products/890/117/003/5007/front_en.7.400.jpg', color: '#FF6347', stockStatus: 'in_stock', brand: 'Haldiram', allergens: ['Peanuts'], tags: ['snack', 'savory'] },

  // Beverages
  { id: 'p24', name: 'Cold Coffee 200ml', category: 'Beverages', price: 60, unit: '200ml', emoji: '☕', imageUrl: 'https://images.openfoodfacts.org/images/products/890/111/068/5001/front_en.6.400.jpg', color: '#6F4E37', stockStatus: 'in_stock', brand: 'Amul', allergens: ['Dairy'], tags: ['beverage', 'cold'] },
  { id: 'p25', name: 'Coca-Cola 750ml', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.openfoodfacts.org/images/products/549/000/050/0814/front_en.114.400.jpg', color: '#FF0000', stockStatus: 'in_stock', brand: 'Coca-Cola', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p26', name: 'Sprite 750ml', category: 'Beverages', price: 40, unit: '750ml', emoji: '🥤', imageUrl: 'https://images.openfoodfacts.org/images/products/544/900/021/4438/front_en.37.400.jpg', color: '#00AA00', stockStatus: 'in_stock', brand: 'Sprite', allergens: [], tags: ['beverage', 'cold'] },
  { id: 'p27', name: 'Mango Juice 1L', category: 'Beverages', price: 95, unit: 'L', emoji: '🥭', imageUrl: 'https://images.openfoodfacts.org/images/products/890/115/002/4006/front_en.9.400.jpg', color: '#FFA500', stockStatus: 'in_stock', brand: 'Real', allergens: [], tags: ['beverage', 'juice'] },
  { id: 'p28', name: 'Green Tea 25 bags', category: 'Beverages', price: 125, unit: '25bags', emoji: '🍵', imageUrl: 'https://images.openfoodfacts.org/images/products/890/117/019/0009/front_en.8.400.jpg', color: '#90EE90', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'] },
  { id: 'p29', name: 'Chai Masala 100g', category: 'Beverages', price: 45, unit: '100g', emoji: '🧉', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chai_masala_ingredients.jpg/320px-Chai_masala_ingredients.jpg', color: '#8B4513', stockStatus: 'in_stock', brand: 'Tata', allergens: [], tags: ['beverage', 'tea'] },

  // Personal Care
  { id: 'p30', name: 'Shampoo 200ml', category: 'Personal Care', price: 180, unit: '200ml', emoji: '🧴', imageUrl: 'https://images.openfoodfacts.org/images/products/087/116/003/3826/front_en.25.400.jpg', color: '#FF69B4', stockStatus: 'in_stock', brand: 'Dove', allergens: [], tags: ['personal'] },
  { id: 'p31', name: 'Face Wash 100g', category: 'Personal Care', price: 85, unit: '100g', emoji: '🧼', imageUrl: 'https://images.openfoodfacts.org/images/products/890/312/104/1000/front_en.6.400.jpg', color: '#00BFFF', stockStatus: 'in_stock', brand: 'Himalaya', allergens: [], tags: ['personal'] },
  { id: 'p32', name: 'Bath Soap 3pk', category: 'Personal Care', price: 75, unit: '3pk', emoji: '🫧', imageUrl: 'https://images.openfoodfacts.org/images/products/087/116/000/5004/front_en.17.400.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Dove', allergens: [], tags: ['personal'] },
  { id: 'p33', name: 'Toothpaste 100g', category: 'Personal Care', price: 95, unit: '100g', emoji: '🪥', imageUrl: 'https://images.openfoodfacts.org/images/products/003/500/053/5628/front_en.35.400.jpg', color: '#00BFFF', stockStatus: 'in_stock', brand: 'Colgate', allergens: [], tags: ['personal'] },

  // Household
  { id: 'p34', name: 'Detergent 1kg', category: 'Household', price: 150, unit: 'kg', emoji: '🧺', imageUrl: 'https://images.openfoodfacts.org/images/products/890/116/700/2002/front_en.7.400.jpg', color: '#4169E1', stockStatus: 'in_stock', brand: 'Surf Excel', allergens: [], tags: ['household', 'laundry'] },
  { id: 'p35', name: 'Floor Cleaner 1L', category: 'Household', price: 95, unit: 'L', emoji: '🧹', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Lizol_floor_cleaner.jpg/320px-Lizol_floor_cleaner.jpg', color: '#00FF7F', stockStatus: 'in_stock', brand: 'Lizol', allergens: [], tags: ['household', 'cleaning'] },
  { id: 'p36', name: 'Dishwash Liquid 500ml', category: 'Household', price: 80, unit: '500ml', emoji: '🍽️', imageUrl: 'https://images.openfoodfacts.org/images/products/890/116/401/1003/front_en.6.400.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Vim', allergens: [], tags: ['household', 'cleaning'] },
  { id: 'p37', name: 'Toilet Cleaner 500ml', category: 'Household', price: 85, unit: '500ml', emoji: '🚽', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Harpic_Power_Plus.jpg/320px-Harpic_Power_Plus.jpg', color: '#00BFFF', stockStatus: 'in_stock', brand: 'Harpic', allergens: [], tags: ['household', 'cleaning'] },

  // Spices
  { id: 'p38', name: 'Turmeric Powder 100g', category: 'Staples', price: 35, unit: '100g', emoji: '🧡', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fresh_turmeric.jpg/320px-Fresh_turmeric.jpg', color: '#FF8C00', stockStatus: 'in_stock', brand: 'Tata Sampann', allergens: [], tags: ['spice'] },
  { id: 'p39', name: 'Red Chilli Powder 100g', category: 'Staples', price: 40, unit: '100g', emoji: '🌶️', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Capsicum_annuum_-_chili_pepper.jpg/320px-Capsicum_annuum_-_chili_pepper.jpg', color: '#DC143C', stockStatus: 'low_stock', brand: 'Tata Sampann', allergens: [], tags: ['spice'] },
  { id: 'p40', name: 'Garam Masala 50g', category: 'Staples', price: 30, unit: '50g', emoji: '🧂', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Garam_masala_spices.jpg/320px-Garam_masala_spices.jpg', color: '#8B4513', stockStatus: 'in_stock', brand: 'MDH', allergens: [], tags: ['spice'] },

  // Protein / Meat
  { id: 'p41', name: 'Chicken 500g', category: 'Staples', price: 140, unit: '500g', emoji: '🍗', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/320px-Good_Food_Display_-_NCI_Visuals_Online.jpg', color: '#FFB6C1', stockStatus: 'in_stock', brand: 'Fresh Meat', allergens: [], tags: ['meat', 'protein', 'non-veg'] },
  { id: 'p42', name: 'Eggs 6pk', category: 'Dairy', price: 36, unit: '6pk', emoji: '🥚', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/White_and_brown_eggs.jpg/320px-White_and_brown_eggs.jpg', color: '#FAFAFA', stockStatus: 'in_stock', brand: 'Farm Fresh', allergens: ['Egg'], tags: ['protein', 'eggs'] },
  { id: 'p43', name: 'Peanut Butter 250g', category: 'Snacks', price: 180, unit: '250g', emoji: '🥜', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9g/Peanut_butter_on_a_spoon.jpg/320px-Peanut_butter_on_a_spoon.jpg', color: '#D2691E', stockStatus: 'in_stock', brand: 'Myfitness', allergens: ['Peanuts'], tags: ['snack', 'protein'] },
  { id: 'p44', name: 'Corn Flakes 500g', category: 'Snacks', price: 140, unit: '500g', emoji: '🥣', imageUrl: 'https://images.openfoodfacts.org/images/products/038/000/394/7021/front_en.49.400.jpg', color: '#FFD700', stockStatus: 'in_stock', brand: 'Kellogg\'s', allergens: ['Gluten'], tags: ['breakfast'] },
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
