export interface Shop {
  id: string;
  name: string;
  domain: string;
  logo: string;
  favicon: string;
  description: string;
  themeColor: string;
  headerLogo: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  category: string;
  categoryId: string;
  stock: number;
  sku: string;
  barcode: string;
  featured: boolean;
  trending: boolean;
  shopId: string;
  createdAt: Date;
  videoUrl?: string;
  heroBadges?: string[];
  features?: string[];
  faqs?: { q: string; a: string }[];
  templateId?: number;
  sizes?: string[];
  outOfStockSizes?: string;
  colors?: string[];
  deliveryDhaka?: number | string;
  deliveryOutside?: number | string;
  storeName?: string;
  storeTagline?: string;
  storePhone?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  customerStatsTitle?: string;
  customerStatsDesc?: string;
  imageColors?: string[];
  showVideo?: boolean;
  showFaqs?: boolean;
  showReviews?: boolean;
  showFeatures?: boolean;
  showSizes?: boolean;
  showColors?: boolean;
  showBadges?: boolean;
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  shopId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  shopId: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: Date;
}

export interface Banner {
  id: string;
  shopId: string;
  type: 'hero' | 'offer';
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  enabled: boolean;
  startDate: Date;
  endDate: Date;
}

export interface Blog {
  id: string;
  shopId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  comment: string;
  date: string;
  rating: number;
  approved: boolean;
}
