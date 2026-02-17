
import { Destination, Promotion, Review, Event, Article } from './types';


// URL backend (otomatis mengikuti IP server)
export const API_BASE_URL = '/api';

export const getProxiedImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') && (
    url.includes('instagram.com') ||
    url.includes('instagr.am') ||
    url.includes('ig.me') ||
    url.includes('googleusercontent.com') ||
    url.includes('pannellum.org') ||
    url.includes('facebook.com') ||
    url.includes('fb.com') ||
    url.includes('fbcdn.net') ||
    url.includes('fb.watch') ||
    url.includes('cdninstagram.com') ||
    url.includes('pariwisata.padang.go.id')
  )) {
    return `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const getStoredUserId = () => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      return JSON.parse(userData).id;
    } catch (e) {
      return 'default-user-id';
    }
  }
  return 'default-user-id';
};

export const apiService = {
  getDestinations: async (): Promise<Destination[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Fetch Destinations Error:", error);
      const { DESTINATIONS } = await import('./constants');
      return DESTINATIONS;
    }
  },

  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Fetch Events Error:", error);
      return [];
    }
  },

  getArticles: async (): Promise<Article[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Fetch Articles Error:", error);
      return [];
    }
  },

  getPromotions: async (): Promise<Promotion[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/promotions`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Fetch Promotions Error:", error);
      const { PROMOTIONS } = await import('./constants');
      return PROMOTIONS;
    }
  },

  getProfile: async (userId: string = getStoredUserId()) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
      if (!response.ok) throw new Error('User not found');
      return await response.json();
    } catch (error) {
      // Fallback logic
      const userData = localStorage.getItem('user_data');
      if (userData) return JSON.parse(userData);

      return {
        name: 'Andi Pratama',
        level: 5,
        points: 450,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      };
    }
  },

  getPublicProfile: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public-profile/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch public profile');
      return await response.json();
    } catch (error) {
      console.error("Fetch Public Profile Error:", error);
      throw error;
    }
  },

  getUserBusinesses: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/user/businesses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil data bisnis');
    return await response.json();
  },

  getPlans: async (): Promise<any[]> => {
    const token = localStorage.getItem('user_token');
    if (!token) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  },

  createPlan: async (planData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(planData)
    });
    if (!response.ok) throw new Error('Failed to create plan');
    return await response.json();
  },

  deletePlan: async (planId: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete plan');
    return await response.json();
  },

  getReviews: async (destinationId: string): Promise<Review[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${destinationId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json();
    } catch (error) {
      console.error("Fetch Reviews Error:", error);
      return [];
    }
  },

  getUserReviews: async (userId: string): Promise<(Review & { destination: { name: string; image: string } })[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch user reviews');
      return await response.json();
    } catch (error) {
      console.error("Fetch User Reviews Error:", error);
      return [];
    }
  },

  submitReview: async (destinationId: string, rating: number, comment: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ destinationId, rating, comment })
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return await response.json();
  },

  getComments: async (articleId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return await response.json();
    } catch (error) {
      console.error("Fetch Comments Error:", error);
      return [];
    }
  },

  submitComment: async (articleId: string, content: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('Gagal mengirim komentar');
    return await response.json();
  },

  generateItinerary: async (data: { duration: number; budget: number; interests: string[] }) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/trip-planner/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal generate itinerary');
    return await response.json();
  },

  getRecommendations: async (category?: string) => {
    const token = localStorage.getItem('user_token');
    const query = category ? `?category=${category}` : '';
    const response = await fetch(`${API_BASE_URL}/recommendations${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Gagal mengambil rekomendasi');
    return await response.json();
  },

  // Stories
  getStories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories`);
      if (!response.ok) throw new Error('Failed to fetch stories');
      return await response.json();
    } catch (error) {
      console.error("Fetch Stories Error:", error);
      return [];
    }
  },

  createStory: async (formData: FormData) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // No Content-Type header needed for FormData
    });
    if (!response.ok) throw new Error('Gagal upload story');
    return await response.json();
  },

  likeStory: async (storyId: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Like failed');
    return await response.json();
  },

  commentStory: async (storyId: string, content: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('Comment failed');
    return await response.json();
  },

  // Guide Marketplace
  getGuides: async () => {
    const response = await fetch(`${API_BASE_URL}/guides`);
    if (!response.ok) throw new Error('Failed to fetch guides');
    return await response.json();
  },

  getGuideDetail: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/guides/${id}`);
    if (!response.ok) throw new Error('Failed to fetch guide details');
    return await response.json();
  },

  getPackages: async (filters?: any) => {
    const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
    const response = await fetch(`${API_BASE_URL}/packages${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch packages');
    return await response.json();
  },

  getPackageDetail: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/packages/${id}`);
    if (!response.ok) throw new Error('Failed to fetch package details');
    return await response.json();
  },

  createBooking: async (bookingData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return await response.json();
  },

  getUserBookings: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user bookings');
    return await response.json();
  },

  // Chat System
  getConversations: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
  },

  startConversation: async (guideId: string, subjectTitle?: string, subjectDate?: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ guideId, subjectTitle, subjectDate })
    });
    if (!response.ok) throw new Error('Failed to start conversation');
    return await response.json();
  },

  getMessages: async (conversationId: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  },

  sendMessage: async (conversationId: string, content: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  },

  // Travel Buddy
  getBuddyPosts: async (filters?: any) => {
    const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
    const response = await fetch(`${API_BASE_URL}/buddies${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch buddy posts');
    return await response.json();
  },

  createBuddyPost: async (postData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/buddies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    if (!response.ok) throw new Error('Failed to create buddy post');
    return await response.json();
  },

  getBuddyPostDetail: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/buddies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch buddy post detail');
    return await response.json();
  },

  applyForBuddy: async (postId: string, message: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/buddies/${postId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to apply for buddy');
    return await response.json();
  },

  updateBuddyApplication: async (applicationId: string, status: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/buddies/applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update application');
    return await response.json();
  },

  // Guide Management
  checkGuideStatus: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/guides/check`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  },

  registerAsGuide: async (guideData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/guides/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(guideData)
    });
    if (!response.ok) throw new Error('Failed to register as guide');
    return await response.json();
  },

  getMyPackages: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/guide/packages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch guide packages');
    return await response.json();
  },

  createPackage: async (packageData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(packageData)
    });
    if (!response.ok) throw new Error('Failed to create package');
    return await response.json();
  },

  updatePackage: async (id: string, packageData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(packageData)
    });
    if (!response.ok) throw new Error('Failed to update package');
    return await response.json();
  },

  getBookings: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  },

  deletePackage: async (id: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete package');
    return await response.json();
  },

  getGuideBookings: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/guide/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch guide bookings');
    return await response.json();
  },

  updateBookingStatus: async (bookingId: string, status: string, cancelReason?: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, cancelReason })
    });
    if (!response.ok) throw new Error('Failed to update booking status');
    return await response.json();
  },

  getGuideStats: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/guide/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch guide statistics');
    return await response.json();
  },

  cancelBooking: async (bookingId: string, reason: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return await response.json();
  },

  // Culinary Spots
  getCulinarySpots: async (filters?: any) => {
    const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
    const response = await fetch(`${API_BASE_URL}/culinary-spots${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch culinary spots');
    return await response.json();
  },

  getCulinarySpotDetail: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/culinary-spots/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil detail kuliner');
    return await response.json();
  },

  applyCulinaryVendor: async (spotData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/culinary/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(spotData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Gagal mendaftar usaha kuliner');
    }
    return await response.json();
  },

  getCulinaryVendorProfile: async (spotId?: string) => {
    const token = localStorage.getItem('user_token');
    const query = spotId ? `?spotId=${spotId}` : '';
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/profile${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil profil kuliner');
    return await response.json();
  },

  updateCulinaryVendorProfile: async (spotData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(spotData)
    });
    if (!response.ok) throw new Error('Gagal memperbarui profil kuliner');
    return await response.json();
  },

  addCulinaryMenu: async (menuData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(menuData)
    });
    if (!response.ok) throw new Error('Gagal menambah menu');
    return await response.json();
  },

  updateCulinaryMenu: async (id: string, menuData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(menuData)
    });
    if (!response.ok) throw new Error('Gagal memperbarui menu');
    return await response.json();
  },

  deleteCulinaryMenu: async (id: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/menu/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal menghapus menu');
    return await response.json();
  },

  getAdminPendingCulinary: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/admin/culinary/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil daftar verifikasi kuliner');
    return await response.json();
  },

  verifyCulinaryVendor: async (id: string, status: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/admin/culinary/${id}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Gagal memverifikasi vendor kuliner');
    return await response.json();
  },

  // --- CULINARY ORDERS ---
  createCulinaryOrder: async (orderData: { spotId: string, items: { menuId: string, quantity: number, note?: string }[], note?: string }) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/culinary/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Gagal membuat pesanan');
    return await response.json();
  },

  getCulinaryOrders: async (spotId?: string) => {
    const token = localStorage.getItem('user_token');
    const query = spotId ? `?spotId=${spotId}` : '';
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/orders${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil data pesanan');
    return await response.json();
  },

  updateCulinaryOrderStatus: async (orderId: string, status: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/culinary/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Gagal memperbarui status pesanan');
    return await response.json();
  },

  getUserCulinaryOrders: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/culinary/orders/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil riwayat pesanan');
    return await response.json();
  },

  // --- SOUVENIRS ---
  getSouvenirVendors: async () => {
    const response = await fetch(`${API_BASE_URL}/souvenirs/vendors`);
    if (!response.ok) throw new Error('Gagal mengambil data toko oleh-oleh');
    return await response.json();
  },
  getSouvenirVendorDetail: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/souvenirs/vendors/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil detail toko');
    return await response.json();
  },

  getSouvenirProducts: async (filters: { category?: string; vendorId?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.vendorId) params.append('vendorId', filters.vendorId);

    const response = await fetch(`${API_BASE_URL}/souvenirs/products?${params.toString()}`);
    if (!response.ok) throw new Error('Gagal mengambil data produk oleh-oleh');
    return await response.json();
  },

  getSouvenirProductDetail: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/souvenirs/products/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil detail produk');
    return await response.json();
  },

  createSouvenirOrder: async (orderData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/souvenirs/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal membuat pesanan');
    }
    return await response.json();
  },

  getUserSouvenirOrders: async (userId: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/souvenirs/orders/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil riwayat pesanan');
    return await response.json();
  },

  // --- SOUVENIR VENDOR ---
  applyAsVendor: async (vendorData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/souvenirs/vendors/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vendorData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal mengirim pendaftaran');
    }
    return await response.json();
  },

  getAdminSouvenirVendors: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/admin/souvenirs/vendors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil daftar vendor');
    return await response.json();
  },

  verifySouvenirVendor: async (vendorId: string, status: 'APPROVED' | 'REJECTED') => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/admin/souvenirs/vendors/${vendorId}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Gagal memverifikasi vendor');
    return await response.json();
  },

  getVendorProducts: async (vendorId?: string) => {
    const token = localStorage.getItem('user_token');
    const query = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/products${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil produk vendor');
    return await response.json();
  },

  getVendorProfile: async (vendorId?: string) => {
    const token = localStorage.getItem('user_token');
    const query = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/profile${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Gagal mengambil profil vendor');
    }
    return await response.json();
  },

  updateVendorProfile: async (profileData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Gagal memperbarui profil (${response.status})`);
    }
    return await response.json();
  },

  getVendorOrders: async (vendorId?: string) => {
    const token = localStorage.getItem('user_token');
    const query = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/orders${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil pesanan vendor');
    return await response.json();
  },

  updateVendorOrderStatus: async (orderId: string, status: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Gagal memperbarui status pesanan');
    return await response.json();
  },

  createVendorProduct: async (productData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Gagal menambah produk (${response.status})`);
    }
    return await response.json();
  },

  updateVendorProduct: async (productId: string, productData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Gagal memperbarui produk');
    return await response.json();
  },

  deleteVendorProduct: async (productId: string) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/vendor/souvenirs/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal menghapus produk');
    return await response.json();
  },

  // Admin Souvenir Orders
  getAdminSouvenirOrders: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/admin/souvenirs/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil daftar pesanan');
    return await response.json();
  },

  updateSouvenirOrderStatus: async (orderId: string, statusData: { status: string; paymentStatus?: string }) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/admin/souvenirs/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(statusData)
    });
    if (!response.ok) throw new Error('Gagal memperbarui status pesanan');
    return await response.json();
  },

  // --- REVIEWS ---
  submitCulinaryReview: async (spotId: string, reviewData: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/culinary-spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
      const errorData = await response.text();
      try {
        const json = JSON.parse(errorData);
        throw new Error(json.error || 'Failed to submit review');
      } catch {
        throw new Error('Failed to submit review');
      }
    }
    return await response.json();
  },

  // Footprints & Badges
  createFootprint: async (data: any) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/footprints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal mencatat jejak');
    }
    return await response.json();
  },

  getFootprints: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/footprints`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil jejak');
    return await response.json();
  },

  getBadges: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/badges`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil data lencana');
    return await response.json();
  },

  getFootprintStats: async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${API_BASE_URL}/footprints/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil statistik');
    return await response.json();
  }
};
