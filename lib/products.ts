export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  tags: string[];
  rating: number;
  reviews: number;
  variants: ProductVariant[];
  variantOptions: VariantOption[];
  featured: boolean;
  new: boolean;
  bestselling: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantOption {
  name: string;
  values: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "tops", name: "Tops", slug: "tops", description: "Premium tops and shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop", productCount: 3 },
  { id: "outerwear", name: "Outerwear", slug: "outerwear", description: "Jackets and coats for every season", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop", productCount: 2 },
  { id: "bottoms", name: "Bottoms", slug: "bottoms", description: "Trousers, jeans, and shorts", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop", productCount: 1 },
  { id: "accessories", name: "Accessories", slug: "accessories", description: "Bags, belts, and more", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop", productCount: 5 },
  { id: "footwear", name: "Footwear", slug: "footwear", description: "Shoes and boots", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop", productCount: 2 },
  { id: "home", name: "Home", slug: "home", description: "Home decor and essentials", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop", productCount: 7 },
  { id: "body-care", name: "Body Care", slug: "body-care", description: "Natural skincare and body products", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop", productCount: 2 },
];

function generateVariants(basePrice: number, sizes: string[], colors: string[]): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let skuCounter = 1000;
  
  for (const size of sizes) {
    for (const color of colors) {
      const priceVariation = Math.random() * 20 - 10;
      const stock = Math.floor(Math.random() * 50) + 5;
      variants.push({
        id: `var-${skuCounter}`,
        name: `${size} / ${color}`,
        sku: `SKU-${skuCounter++}`,
        price: Math.round((basePrice + priceVariation) * 100) / 100,
        compareAtPrice: Math.random() > 0.7 ? Math.round((basePrice + 20) * 100) / 100 : undefined,
        stock,
        attributes: { size, color },
      });
    }
  }
  return variants;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    slug: "vintage-denim-jacket",
    description: "Classic vintage denim jacket with a modern fit. Features distressed details and comfortable stretch denim. Perfect for layering in any season. Each jacket is individually crafted with attention to detail, featuring authentic wear patterns and premium hardware.",
    shortDescription: "Classic vintage denim with modern fit",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=750&fit=crop",
    ],
    category: "Outerwear",
    brand: "Heritage Denim Co.",
    tags: ["vintage", "denim", "casual", "layering"],
    rating: 4.8,
    reviews: 124,
    variants: generateVariants(89.99, ["XS", "S", "M", "L", "XL"], ["Vintage Wash", "Dark Indigo", "Light Stone"]),
    variantOptions: [
      { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
      { name: "Color", values: ["Vintage Wash", "Dark Indigo", "Light Stone"] },
    ],
    featured: true,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-20"),
  },
  {
    id: 2,
    name: "Handwoven Market Tote",
    slug: "handwoven-market-tote",
    description: "Artisan-crafted market tote made from natural seagrass. Spacious interior with cotton lining. Each piece is unique with slight variations that speak to its handmade nature.",
    shortDescription: "Artisan seagrass tote with cotton lining",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop"],
    category: "Accessories",
    brand: "Artisan Collective",
    tags: ["handmade", "sustainable", "artisan", "summer"],
    rating: 4.9,
    reviews: 89,
    variants: [
      { id: "var-2001", name: "Natural", sku: "SKU-2001", price: 48, stock: 23, attributes: { color: "Natural" } },
      { id: "var-2002", name: "Whitewash", sku: "SKU-2002", price: 52, stock: 15, attributes: { color: "Whitewash" } },
    ],
    variantOptions: [{ name: "Color", values: ["Natural", "Whitewash"] }],
    featured: true,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    description: "Premium organic cotton t-shirt with a relaxed fit. Pre-washed for extra softness. Available in multiple earth-tone colors. Made from 100% GOTS certified organic cotton.",
    shortDescription: "Premium organic cotton, relaxed fit",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop"],
    category: "Tops",
    brand: "Conscious Basics",
    tags: ["organic", "cotton", "basics", "sustainable"],
    rating: 4.7,
    reviews: 256,
    variants: generateVariants(34.99, ["XS", "S", "M", "L", "XL", "XXL"], ["Off-White", "Clay", "Sage", "Charcoal"]),
    variantOptions: [
      { name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
      { name: "Color", values: ["Off-White", "Clay", "Sage", "Charcoal"] },
    ],
    featured: false,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 4,
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    description: "Handmade ceramic pour-over coffee set with matching carafe. Includes reusable stainless steel filter. Each piece is hand-thrown and glazed.",
    shortDescription: "Handmade ceramic coffee brewing set",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Morning Rituals",
    tags: ["ceramic", "coffee", "handmade", "kitchen"],
    rating: 4.9,
    reviews: 67,
    variants: [
      { id: "var-4001", name: "Cream", sku: "SKU-4001", price: 65, stock: 18, attributes: { color: "Cream" } },
      { id: "var-4002", name: "Speckled Grey", sku: "SKU-4002", price: 68, stock: 12, attributes: { color: "Speckled Grey" } },
      { id: "var-4003", name: "Matte Black", sku: "SKU-4003", price: 70, stock: 8, attributes: { color: "Matte Black" } },
    ],
    variantOptions: [{ name: "Color", values: ["Cream", "Speckled Grey", "Matte Black"] }],
    featured: true,
    new: true,
    bestselling: false,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-06-15"),
  },
  {
    id: 5,
    name: "Linen Blend Trousers",
    slug: "linen-blend-trousers",
    description: "Breathable linen-cotton blend trousers with a relaxed fit. Perfect for warm weather. Features side pockets and drawstring waist for comfort.",
    shortDescription: "Breathable linen-cotton blend",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop"],
    category: "Bottoms",
    brand: "Summer House",
    tags: ["linen", "summer", "relaxed", "breathable"],
    rating: 4.6,
    reviews: 98,
    variants: generateVariants(78, ["28", "30", "32", "34", "36"], ["Natural", "Sand", "Navy"]),
    variantOptions: [
      { name: "Size", values: ["28", "30", "32", "34", "36"] },
      { name: "Color", values: ["Natural", "Sand", "Navy"] },
    ],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: 6,
    name: "Beeswax Candle Set",
    slug: "beeswax-candle-set",
    description: "Set of 3 hand-poured beeswax candles in glass vessels. Natural honey scent with cotton wicks. Burn time of 40 hours each.",
    shortDescription: "Set of 3 natural beeswax candles",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Hive & Harvest",
    tags: ["beeswax", "natural", "gift", "home"],
    rating: 4.8,
    reviews: 143,
    variants: [
      { id: "var-6001", name: "Classic Set", sku: "SKU-6001", price: 42, stock: 67, attributes: { set: "Classic Set" } },
      { id: "var-6002", name: "Gift Box", sku: "SKU-6002", price: 55, stock: 34, attributes: { set: "Gift Box" } },
    ],
    variantOptions: [{ name: "Set", values: ["Classic Set", "Gift Box"] }],
    featured: false,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: 7,
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description: "Full-grain leather crossbody bag with adjustable strap. Features multiple compartments and brass hardware. Ages beautifully over time.",
    shortDescription: "Full-grain leather, brass hardware",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop"],
    category: "Accessories",
    brand: "Saddle & Stitch",
    tags: ["leather", "handcrafted", "classic", "everyday"],
    rating: 4.9,
    reviews: 201,
    variants: [
      { id: "var-7001", name: "Cognac", sku: "SKU-7001", price: 145, stock: 12, attributes: { color: "Cognac" } },
      { id: "var-7002", name: "Black", sku: "SKU-7002", price: 145, stock: 18, attributes: { color: "Black" } },
      { id: "var-7003", name: "Tan", sku: "SKU-7003", price: 149, stock: 8, attributes: { color: "Tan" } },
    ],
    variantOptions: [{ name: "Color", values: ["Cognac", "Black", "Tan"] }],
    featured: true,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 8,
    name: "Wool Blend Cardigan",
    slug: "wool-blend-cardigan",
    description: "Cozy wool-cotton blend cardigan with mother-of-pearl buttons. Relaxed fit perfect for layering. Hand-knit details on cuffs.",
    shortDescription: "Wool-cotton blend, mother-of-pearl buttons",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=750&fit=crop"],
    category: "Outerwear",
    brand: "Knit Studio",
    tags: ["wool", "cozy", "handcrafted", "layering"],
    rating: 4.7,
    reviews: 78,
    variants: generateVariants(125, ["XS", "S", "M", "L", "XL"], ["Oatmeal", "Heather Grey", "Forest"]),
    variantOptions: [
      { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
      { name: "Color", values: ["Oatmeal", "Heather Grey", "Forest"] },
    ],
    featured: false,
    new: true,
    bestselling: false,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-06-20"),
  },
  {
    id: 9,
    name: "Stone Washed Bedding Set",
    slug: "stone-washed-bedding-set",
    description: "100% linen bedding set in queen size. Includes duvet cover and two pillowcases. Stone-washed for ultimate softness.",
    shortDescription: "100% linen, queen size set",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Rest & Renew",
    tags: ["linen", "bedding", "luxury", "home"],
    rating: 4.9,
    reviews: 45,
    variants: [
      { id: "var-9001", name: "Queen / Natural", sku: "SKU-9001", price: 220, stock: 8, attributes: { size: "Queen", color: "Natural" } },
      { id: "var-9002", name: "Queen / White", sku: "SKU-9002", price: 220, stock: 5, attributes: { size: "Queen", color: "White" } },
      { id: "var-9003", name: "King / Natural", sku: "SKU-9003", price: 280, stock: 4, attributes: { size: "King", color: "Natural" } },
    ],
    variantOptions: [
      { name: "Size", values: ["Queen", "King"] },
      { name: "Color", values: ["Natural", "White"] },
    ],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 10,
    name: "Silk Blend Scarf",
    slug: "silk-blend-scarf",
    description: "Luxurious silk-modal blend scarf with hand-rolled edges. Abstract botanical print in muted tones. 70cm x 180cm.",
    shortDescription: "Silk-modal blend, botanical print",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=750&fit=crop"],
    category: "Accessories",
    brand: "Silk Road",
    tags: ["silk", "botanical", "elegant", "gift"],
    rating: 4.8,
    reviews: 112,
    variants: [
      { id: "var-10001", name: "Rose Garden", sku: "SKU-10001", price: 68, stock: 41, attributes: { pattern: "Rose Garden" } },
      { id: "var-10002", name: "Midnight Fern", sku: "SKU-10002", price: 68, stock: 23, attributes: { pattern: "Midnight Fern" } },
    ],
    variantOptions: [{ name: "Pattern", values: ["Rose Garden", "Midnight Fern"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: 11,
    name: "Bamboo Kitchen Set",
    slug: "bamboo-kitchen-set",
    description: "Complete bamboo kitchen utensil set. Includes spatula, spoon, fork, and serving tongs. Naturally antibacterial and eco-friendly.",
    shortDescription: "Complete bamboo utensil collection",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Green Kitchen",
    tags: ["bamboo", "eco-friendly", "kitchen", "sustainable"],
    rating: 4.6,
    reviews: 89,
    variants: [
      { id: "var-11001", name: "4-Piece Set", sku: "SKU-11001", price: 38, stock: 52, attributes: { set: "4-Piece Set" } },
      { id: "var-11002", name: "8-Piece Set", sku: "SKU-11002", price: 58, stock: 28, attributes: { set: "8-Piece Set" } },
    ],
    variantOptions: [{ name: "Set", values: ["4-Piece Set", "8-Piece Set"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-04-15"),
  },
  {
    id: 12,
    name: "Canvas Sneakers",
    slug: "canvas-sneakers",
    description: "Classic canvas sneakers with natural rubber soles. Comfortable memory foam insole. Available in off-white and natural grey.",
    shortDescription: "Classic canvas with memory foam",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=750&fit=crop"],
    category: "Footwear",
    brand: "Grounded",
    tags: ["canvas", "comfortable", "everyday", "sustainable"],
    rating: 4.5,
    reviews: 234,
    variants: generateVariants(72, ["6", "7", "8", "9", "10", "11"], ["Off-White", "Natural Grey", "Navy"]),
    variantOptions: [
      { name: "Size", values: ["6", "7", "8", "9", "10", "11"] },
      { name: "Color", values: ["Off-White", "Natural Grey", "Navy"] },
    ],
    featured: false,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 13,
    name: "Hand-Poured Soap Bar",
    slug: "hand-poured-soap-bar",
    description: "Cold-process soap bar made with olive oil and shea butter. Scented with natural lavender essential oil. Gentle for sensitive skin.",
    shortDescription: "Natural lavender, cold-process",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=750&fit=crop"],
    category: "Body Care",
    brand: "Botanica",
    tags: ["natural", "lavender", "handmade", "skincare"],
    rating: 4.9,
    reviews: 312,
    variants: [
      { id: "var-13001", name: "Lavender", sku: "SKU-13001", price: 12, stock: 156, attributes: { scent: "Lavender" } },
      { id: "var-13002", name: "Eucalyptus", sku: "SKU-13002", price: 12, stock: 89, attributes: { scent: "Eucalyptus" } },
      { id: "var-13003", name: "Unscented", sku: "SKU-13003", price: 10, stock: 67, attributes: { scent: "Unscented" } },
    ],
    variantOptions: [{ name: "Scent", values: ["Lavender", "Eucalyptus", "Unscented"] }],
    featured: false,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 14,
    name: "Cashmere Beanie",
    slug: "cashmere-beanie",
    description: "100% pure cashmere beanie in a relaxed fit. Lightweight yet incredibly warm. Hand-knit in small batches.",
    shortDescription: "100% cashmere, hand-knit",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=750&fit=crop"],
    category: "Accessories",
    brand: "Highland Knits",
    tags: ["cashmere", "luxury", "warm", "winter"],
    rating: 4.8,
    reviews: 156,
    variants: [
      { id: "var-14001", name: "Oatmeal", sku: "SKU-14001", price: 55, stock: 28, attributes: { color: "Oatmeal" } },
      { id: "var-14002", name: "Charcoal", sku: "SKU-14002", price: 55, stock: 34, attributes: { color: "Charcoal" } },
      { id: "var-14003", name: "Blush", sku: "SKU-14003", price: 55, stock: 15, attributes: { color: "Blush" } },
    ],
    variantOptions: [{ name: "Color", values: ["Oatmeal", "Charcoal", "Blush"] }],
    featured: true,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 15,
    name: "Recycled Glass Vase",
    slug: "recycled-glass-vase",
    description: "Handblown vase made from 100% recycled glass. Unique blue-green tint with subtle texture. Perfect for dried or fresh flowers.",
    shortDescription: "100% recycled handblown glass",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Reclaimed Beauty",
    tags: ["recycled", "glass", "artisan", "sustainable"],
    rating: 4.7,
    reviews: 67,
    variants: [
      { id: "var-15001", name: "Small", sku: "SKU-15001", price: 45, stock: 19, attributes: { size: "Small" } },
      { id: "var-15002", name: "Medium", sku: "SKU-15002", price: 58, stock: 12, attributes: { size: "Medium" } },
      { id: "var-15003", name: "Large", sku: "SKU-15003", price: 72, stock: 6, attributes: { size: "Large" } },
    ],
    variantOptions: [{ name: "Size", values: ["Small", "Medium", "Large"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: 16,
    name: "Merino Wool Sweater",
    slug: "merino-wool-sweater",
    description: "Ultra-soft merino wool sweater in a relaxed silhouette. Temperature-regulating and moisture-wicking. Perfect for transitional weather.",
    shortDescription: "Ultra-soft merino, relaxed fit",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop"],
    category: "Tops",
    brand: "Wool & Wire",
    tags: ["merino", "wool", "versatile", "basics"],
    rating: 4.8,
    reviews: 189,
    variants: generateVariants(98, ["XS", "S", "M", "L", "XL"], ["Ivory", "Dusty Rose", "Navy", "Camel"]),
    variantOptions: [
      { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
      { name: "Color", values: ["Ivory", "Dusty Rose", "Navy", "Camel"] },
    ],
    featured: false,
    new: true,
    bestselling: true,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-06-15"),
  },
  {
    id: 17,
    name: "Japanese Tea Set",
    slug: "japanese-tea-set",
    description: "Traditional Japanese-inspired tea set with four cups and teapot. Hand-glazed ceramic with minimalist aesthetic.",
    shortDescription: "Hand-glazed ceramic, 6 pieces",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Tea Ceremony",
    tags: ["japanese", "ceramic", "tea", "gift"],
    rating: 4.9,
    reviews: 56,
    variants: [
      { id: "var-17001", name: "White", sku: "SKU-17001", price: 85, stock: 15, attributes: { color: "White" } },
      { id: "var-17002", name: "Celadon", sku: "SKU-17002", price: 88, stock: 9, attributes: { color: "Celadon" } },
    ],
    variantOptions: [{ name: "Color", values: ["White", "Celadon"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 18,
    name: "Leather Belt",
    slug: "leather-belt",
    description: "Full-grain leather belt with solid brass buckle. Hand-stitched edges. Will develop a beautiful patina over time.",
    shortDescription: "Full-grain leather, brass buckle",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop"],
    category: "Accessories",
    brand: "Saddle & Stitch",
    tags: ["leather", "handcrafted", "classic", "everyday"],
    rating: 4.7,
    reviews: 145,
    variants: [
      { id: "var-18001", name: "32 / Cognac", sku: "SKU-18001", price: 58, stock: 20, attributes: { size: "32", color: "Cognac" } },
      { id: "var-18002", name: "34 / Cognac", sku: "SKU-18002", price: 58, stock: 18, attributes: { size: "34", color: "Cognac" } },
      { id: "var-18003", name: "36 / Cognac", sku: "SKU-18003", price: 58, stock: 12, attributes: { size: "36", color: "Cognac" } },
      { id: "var-18004", name: "32 / Black", sku: "SKU-18004", price: 58, stock: 25, attributes: { size: "32", color: "Black" } },
      { id: "var-18005", name: "34 / Black", sku: "SKU-18005", price: 58, stock: 22, attributes: { size: "34", color: "Black" } },
      { id: "var-18006", name: "36 / Black", sku: "SKU-18006", price: 58, stock: 15, attributes: { size: "36", color: "Black" } },
    ],
    variantOptions: [
      { name: "Size", values: ["32", "34", "36"] },
      { name: "Color", values: ["Cognac", "Black"] },
    ],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-04-01"),
  },
  {
    id: 19,
    name: "Organic Body Oil",
    slug: "organic-body-oil",
    description: "Nourishing body oil blend with jojoba, almond, and vitamin E. Light citrus scent. Absorbs quickly without greasy residue.",
    shortDescription: "Jojoba & almond blend, citrus scent",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop"],
    category: "Body Care",
    brand: "Botanica",
    tags: ["organic", "nourishing", "natural", "skincare"],
    rating: 4.8,
    reviews: 178,
    variants: [
      { id: "var-19001", name: "4 oz", sku: "SKU-19001", price: 32, stock: 89, attributes: { size: "4 oz" } },
      { id: "var-19002", name: "8 oz", sku: "SKU-19002", price: 52, stock: 45, attributes: { size: "8 oz" } },
    ],
    variantOptions: [{ name: "Size", values: ["4 oz", "8 oz"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 20,
    name: "Woven Beach Tote",
    slug: "woven-beach-tote",
    description: "Spacious woven beach tote with cotton lining and interior pocket. Durable construction perfect for beach days or farmers markets.",
    shortDescription: "Spacious woven tote, cotton lined",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=750&fit=crop"],
    category: "Accessories",
    brand: "Summer House",
    tags: ["woven", "summer", "beach", "everyday"],
    rating: 4.6,
    reviews: 98,
    variants: [
      { id: "var-20001", name: "Natural Stripe", sku: "SKU-20001", price: 52, stock: 34, attributes: { color: "Natural Stripe" } },
      { id: "var-20002", name: "Blue Stripe", sku: "SKU-20002", price: 52, stock: 28, attributes: { color: "Blue Stripe" } },
    ],
    variantOptions: [{ name: "Color", values: ["Natural Stripe", "Blue Stripe"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: 21,
    name: "Cotton Robe",
    slug: "cotton-robe",
    description: "Luxurious Turkish cotton robe with shawl collar. Ultra-absorbent and quick-drying. Perfect for spa days at home.",
    shortDescription: "Turkish cotton, shawl collar",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Rest & Renew",
    tags: ["cotton", "luxury", "spa", "home"],
    rating: 4.9,
    reviews: 134,
    variants: generateVariants(78, ["S/M", "L/XL"], ["White", "Light Grey", "Blush"]),
    variantOptions: [
      { name: "Size", values: ["S/M", "L/XL"] },
      { name: "Color", values: ["White", "Light Grey", "Blush"] },
    ],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 22,
    name: "Suede Ankle Boots",
    slug: "suede-ankle-boots",
    description: "Handcrafted suede ankle boots with leather sole. Memory foam insole for all-day comfort. Timeless silhouette.",
    shortDescription: "Handcrafted suede, memory foam",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop"],
    category: "Footwear",
    brand: "Grounded",
    tags: ["suede", "handcrafted", "comfortable", "everyday"],
    rating: 4.8,
    reviews: 167,
    variants: generateVariants(165, ["6", "7", "8", "9", "10"], ["Tan", "Black", "Grey"]),
    variantOptions: [
      { name: "Size", values: ["6", "7", "8", "9", "10"] },
      { name: "Color", values: ["Tan", "Black", "Grey"] },
    ],
    featured: true,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: 23,
    name: "Linen Shirt",
    slug: "linen-shirt",
    description: "Relaxed linen shirt with mother-of-pearl buttons. Breathable and lightweight. Perfect for warm days and layered looks.",
    shortDescription: "Relaxed linen, mother-of-pearl buttons",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop"],
    category: "Tops",
    brand: "Summer House",
    tags: ["linen", "breathable", "summer", "basics"],
    rating: 4.7,
    reviews: 198,
    variants: generateVariants(68, ["XS", "S", "M", "L", "XL"], ["White", "Sky Blue", "Sand", "Olive"]),
    variantOptions: [
      { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
      { name: "Color", values: ["White", "Sky Blue", "Sand", "Olive"] },
    ],
    featured: false,
    new: false,
    bestselling: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 24,
    name: "Copper Coffee Mug Set",
    slug: "copper-coffee-mug-set",
    description: "Set of 4 hand-hammered copper coffee mugs. Tinned interior for safe drinking. Includes wooden serving tray.",
    shortDescription: "4 hand-hammered mugs with tray",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Copper & Co.",
    tags: ["copper", "handcrafted", "coffee", "gift"],
    rating: 4.8,
    reviews: 67,
    variants: [
      { id: "var-24001", name: "Standard Set", sku: "SKU-24001", price: 95, stock: 12, attributes: { set: "Standard Set" } },
      { id: "var-24002", name: "Gift Set with Stand", sku: "SKU-24002", price: 125, stock: 8, attributes: { set: "Gift Set with Stand" } },
    ],
    variantOptions: [{ name: "Set", values: ["Standard Set", "Gift Set with Stand"] }],
    featured: false,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: 25,
    name: "Alpaca Wool Throw",
    slug: "alpaca-wool-throw",
    description: "Ultra-soft alpaca wool throw blanket in natural cream. Lightweight yet incredibly warm. Hand-loomed by artisans.",
    shortDescription: "Hand-loomed alpaca wool blanket",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=750&fit=crop",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=750&fit=crop"],
    category: "Home",
    brand: "Andean Artisans",
    tags: ["alpaca", "luxury", "handmade", "home"],
    rating: 4.9,
    reviews: 45,
    variants: [
      { id: "var-25001", name: "Throw / Natural", sku: "SKU-25001", price: 180, stock: 9, attributes: { size: "Throw", color: "Natural" } },
      { id: "var-25002", name: "Throw / Charcoal", sku: "SKU-25002", price: 180, stock: 6, attributes: { size: "Throw", color: "Charcoal" } },
      { id: "var-25003", name: "Large / Natural", sku: "SKU-25003", price: 280, stock: 4, attributes: { size: "Large", color: "Natural" } },
    ],
    variantOptions: [
      { name: "Size", values: ["Throw", "Large"] },
      { name: "Color", values: ["Natural", "Charcoal"] },
    ],
    featured: true,
    new: false,
    bestselling: false,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-05-01"),
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getProductsByTag(tag: string): Product[] {
  return products.filter((p) => p.tags.includes(tag.toLowerCase()));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.new);
}

export function getBestsellingProducts(): Product[] {
  return products.filter((p) => p.bestselling);
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}

export function getTags(): string[] {
  const allTags = products.flatMap((p) => p.tags);
  return [...new Set(allTags)];
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

export function filterProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStock?: boolean;
  featured?: boolean;
  new?: boolean;
  bestselling?: boolean;
}): Product[] {
  return products.filter((p) => {
    const minVariantPrice = Math.min(...p.variants.map((v) => v.price));

    if (filters.category && p.category !== filters.category) return false;
    if (filters.minPrice !== undefined && minVariantPrice < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && minVariantPrice > filters.maxPrice) return false;
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some((t) => p.tags.includes(t.toLowerCase()))) return false;
    }
    if (filters.inStock && !p.variants.some((v) => v.stock > 0)) return false;
    if (filters.featured && !p.featured) return false;
    if (filters.new && !p.new) return false;
    if (filters.bestselling && !p.bestselling) return false;

    return true;
  });
}

export function sortProducts(productsList: Product[], sortBy: string): Product[] {
  const sorted = [...productsList];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => v.price));
        const bMin = Math.min(...b.variants.map((v) => v.price));
        return aMin - bMin;
      });
    case "price-desc":
      return sorted.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => v.price));
        const bMin = Math.min(...b.variants.map((v) => v.price));
        return bMin - aMin;
      });
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case "name":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function getVariantById(productId: number, variantId: string): ProductVariant | undefined {
  const product = getProductById(productId);
  return product?.variants.find((v) => v.id === variantId);
}

export function getLowStockProducts(threshold: number = 10): Product[] {
  return products.filter((p) => p.variants.some((v) => v.stock > 0 && v.stock <= threshold));
}

export function getOutOfStockProducts(): Product[] {
  return products.filter((p) => p.variants.every((v) => v.stock === 0));
}

export function getTotalInventory(): number {
  return products.reduce((total, p) => {
    return total + p.variants.reduce((sum, v) => sum + v.stock, 0);
  }, 0);
}
