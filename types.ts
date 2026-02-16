export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  level: number;
  points: number;
  role: 'USER' | 'ADMIN' | 'VENDOR' | 'CULINARY' | 'GUIDE';
  bio?: string;
  phone?: string;
}

export interface Destination {
  id: string;
  name: string;
  category: 'Alam' | 'Kuliner' | 'Budaya' | 'Belanja' | 'Religi';
  rating: number;
  location: string;
  image: string;
  image360?: string;
  audioNarration?: string;
  hotspots?: any;
  scenes?: any;
  isEnhanced?: boolean;
  description: string;
  videoUrl?: string;
  price?: string;
  coordinates: { lat: number; lng: number };
}

export interface Promotion {
  id: string;
  title: string;
  discount: string;
  image: string;
  videoUrl?: string;
  provider: string;
}
export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  videoUrl?: string;
  description: string;
  price?: string;
  createdAt?: string;
}

export enum AppScreen {
  SPLASH = 'splash',
  HOME = 'home',
  EXPLORE = 'explore',
  PLAN = 'plan',
  PROMO = 'promo',
  EVENTS = 'events',
  PROFILE = 'profile',
  SERVICES = 'services',
  DETAIL = 'detail',
  ADMIN_USERS = 'admin_users',
  LOGIN = 'login',
  REGISTER = 'register',
  SETTINGS = 'settings',
  ARTICLE_DETAIL = 'article_detail',
  TRIP_PLANNER = 'trip_planner',
  GUIDE_MARKETPLACE = 'guide_marketplace',
  TOUR_PACKAGE_DETAIL = 'tour_package_detail',
  CHAT = 'chat',
  CONVERSATIONS = 'conversations',
  BOOKING = 'booking',
  TRAVEL_BUDDY = 'travel_buddy',
  CREATE_BUDDY_POST = 'create_buddy_post',
  BUDDY_POST_DETAIL = 'buddy_post_detail',
  GUIDE_DASHBOARD = 'guide_dashboard',
  CREATE_PACKAGE = 'create_package',
  PUBLIC_PROFILE = 'public_profile',
  CULINARY_SPOTS = 'culinary_spots',
  CULINARY_DETAIL = 'culinary_detail',
  FOOTPRINT = 'footprint',
  BADGES = 'badges',
  SOUVENIR_MARKETPLACE = 'souvenir_marketplace',
  SOUVENIR_DETAIL = 'souvenir_detail',
  SOUVENIR_ORDERS = 'souvenir_orders',
  SOUVENIR_VENDOR_APPLY = 'souvenir_vendor_apply',
  SOUVENIR_VENDOR_DETAIL = 'souvenir_vendor_detail',
  CULINARY_VENDOR_APPLY = 'culinary_vendor_apply',
  VENDOR_DASHBOARD = 'vendor_dashboard',
  CULINARY_DASHBOARD = 'culinary_dashboard',
  CULINARY_ORDER_HISTORY = 'culinary_order_history'
}

export interface TravelBuddyPost {
  id: string;
  userId: string;
  destinationId?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxBuddies: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  requirements?: string;
  budgetRange?: string;
  createdAt: string;
  user?: User;
  destination?: Destination;
  applications?: TravelBuddyApplication[];
  _count?: {
    applications: number;
  };
}

export interface TravelBuddyApplication {
  id: string;
  postId: string;
  userId: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  user?: User;
}

export interface Conversation {
  id: string;
  guideId?: string;
  guide?: Guide;
  members: any[];
  messages: Message[];
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sender?: {
    name: string;
    avatar: string | null;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatar: string | null;
  };
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  videoUrl?: string;
  category: string;
  author: string;
  date: string;
  createdAt?: string;
}

export interface Story {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string | null;
  };
  caption?: string;
  location?: string;
  viewCount: number;
  createdAt: string;
  expiresAt?: string;
  media: StoryMedia[];
  likes: StoryLike[];
  comments: StoryComment[];
  isLiked?: boolean; // Helper for UI
}

export interface StoryMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

export interface StoryLike {
  id: string;
  userId: string;
}

export interface StoryComment {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string | null;
  };
  content: string;
  createdAt: string;
}

export interface Guide {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  verificationLevel: 'BASIC' | 'VERIFIED' | 'PROFESSIONAL';
  bio: string;
  languages: string[];
  specializations: string[];
  yearsExperience: number;
  videoIntroUrl?: string;
  certifications: string[];
  averageRating: number;
  totalTours: number;
  totalReviews: number;
  responseRate: number;
  responseTime?: number;
  user?: {
    name: string;
    avatar: string | null;
  };
}

export interface TourPackage {
  id: string;
  guideId: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  duration: number;
  durationType: 'HALF_DAY' | 'FULL_DAY' | 'MULTI_DAY';
  maxParticipants: number;
  basePrice: number;
  meetingPoint: string;
  itinerary: any[];
  inclusions: string[];
  exclusions: string[];
  requirements: any;
  photos: string[];
  videoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  averageRating: number;
  guide?: Guide;
}

export interface Booking {
  id: string;
  packageId: string;
  guideId: string;
  userId: string;
  tourDate: string;
  participants: number;
  totalPrice: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  package?: TourPackage;
  guide?: Guide;
}

export interface CulinarySpot {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  images: string[];
  videoUrl?: string;
  facilities: string[];
  openingHours: any;
  menuHighlights: any;
  rating: number;
  totalReviews: number;
  isHalal: boolean;
  userId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user?: { name: string; avatar: string | null };
  menu?: CulinaryMenu[];
  reviews?: CulinaryReview[];
}

export interface CulinaryMenu {
  id: string;
  spotId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CulinaryReview {
  id: string;
  spotId: string;
  userId: string;
  rating: number;
  tasteRating?: number;
  serviceRating?: number;
  ambienceRating?: number;
  comment: string;
  photos: string[];
  createdAt: string;
  user?: {
    name: string;
    avatar: string | null;
  };
}

export interface Footprint {
  id: string;
  userId: string;
  visitDate: string;
  lat: number;
  lng: number;
  type: 'GPS_AUTO' | 'QR_SCAN' | 'MANUAL';
  note?: string;
  pointsEarned: number;
  destinationId?: string;
  culinarySpotId?: string;
  eventId?: string;
  destination?: Destination;
  culinarySpot?: CulinarySpot;
  event?: Event;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  threshold: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'LEGEND';
  unlocked?: boolean;
}

export interface FootprintStats {
  totalVisits: number;
  destinationsCount: number;
  culinaryCount: number;
  eventsCount: number;
  totalPoints: number;
  level: number;
}

export interface SouvenirVendor {
  id: string;
  userId: string;
  name: string;
  description: string;
  image: string;
  location: string;
  videoUrl?: string;
  lat?: number;
  lng?: number;
  contact?: string;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SouvenirProduct {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  vendor?: SouvenirVendor;
}

export interface SouvenirOrder {
  id: string;
  userId: string;
  vendorId: string;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID';
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
  items: SouvenirOrderItem[];
  user?: User;
  vendor?: SouvenirVendor;
}

export interface SouvenirOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: SouvenirProduct;
}
