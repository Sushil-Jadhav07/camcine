// Camcine - Auth Service (Mock API)
import { mockUsers } from '@/data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let currentUser = null;

export const authService = {
  async login(email, password) {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    currentUser = user;
    localStorage.setItem('camcine_user', JSON.stringify(user));
    return user;
  },

  async register(email, password, name) {
    await delay(1000);
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'viewer',
      subscription: 'free',
      createdAt: new Date(),
      preferences: {
        languages: ['Hindi', 'English'],
        genres: ['Drama', 'Comedy'],
        regions: ['Bollywood'],
        autoplay: true,
        subtitles: true,
        quality: 'auto',
      },
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    localStorage.setItem('camcine_user', JSON.stringify(newUser));
    return newUser;
  },

  async logout() {
    await delay(300);
    currentUser = null;
    localStorage.removeItem('camcine_user');
  },

  async getCurrentUser() {
    await delay(300);
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem('camcine_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },

  async updateProfile(userId, updates) {
    await delay(600);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    currentUser = mockUsers[userIndex];
    localStorage.setItem('camcine_user', JSON.stringify(currentUser));
    return mockUsers[userIndex];
  },

  async updateSubscription(userId, subscription) {
    await delay(800);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex].subscription = subscription;
    mockUsers[userIndex].subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    currentUser = mockUsers[userIndex];
    localStorage.setItem('camcine_user', JSON.stringify(currentUser));
    return mockUsers[userIndex];
  },

  async updatePreferences(userId, preferences) {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex].preferences = { 
      ...mockUsers[userIndex].preferences, 
      ...preferences 
    };
    currentUser = mockUsers[userIndex];
    localStorage.setItem('camcine_user', JSON.stringify(currentUser));
    return mockUsers[userIndex];
  },

  async checkContentAccess(userId, contentId) {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return false;
    
    if (user.subscription === 'premium' || user.subscription === 'family') {
      return true;
    }
    
    return true;
  },

  async forgotPassword(email) {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }
  },

  async resetPassword(token, newPassword) {
    await delay(800);
  },
};
