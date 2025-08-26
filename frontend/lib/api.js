const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authentication token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/registration/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await this.request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Property methods
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/properties/?${queryParams}` : '/properties/';
    return this.request(endpoint);
  }

  async getProperty(id) {
    return this.request(`/properties/${id}/`);
  }

  async createProperty(propertyData) {
    return this.request('/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id, propertyData) {
    return this.request(`/properties/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id) {
    return this.request(`/properties/${id}/`, {
      method: 'DELETE',
    });
  }

  // Reservation methods
  async createReservation(reservationData) {
    return this.request('/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async getUserReservations() {
    return this.request('/reservations/');
  }

  async getReservation(id) {
    return this.request(`/reservations/${id}/`);
  }

  async updateReservation(id, reservationData) {
    return this.request(`/reservations/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(reservationData),
    });
  }

  async cancelReservation(id) {
    return this.request(`/reservations/${id}/cancel/`, {
      method: 'POST',
    });
  }

  // Review methods
  async createReview(reviewData) {
    return this.request('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getPropertyReviews(propertyId) {
    return this.request(`/reviews/?property=${propertyId}`);
  }

  async updateReview(id, reviewData) {
    return this.request(`/reviews/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}/`, {
      method: 'DELETE',
    });
  }

  // Wishlist methods
  async getWishlist() {
    return this.request('/wishlist/');
  }

  async addToWishlist(propertyId) {
    return this.request('/wishlist/', {
      method: 'POST',
      body: JSON.stringify({ property: propertyId }),
    });
  }

  async removeFromWishlist(id) {
    return this.request(`/wishlist/${id}/`, {
      method: 'DELETE',
    });
  }

  // User methods
  async getCurrentUser() {
    return this.request('/auth/user/');
  }

  async updateUserProfile(userData) {
    return this.request('/auth/user/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
