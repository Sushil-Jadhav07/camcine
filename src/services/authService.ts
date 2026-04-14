// Camcine - Auth Service (Mock API)
import type { User, SubscriptionType } from '@/types';
import { mockUsers } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated token storage
let currentUser: User | null = null;

export const authService = {
  // Login
  async login(email: string, password: string): Promise<User> {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    currentUser = user;
    localStorage.setItem('camcine_user', JSON.stringify(user));
    return user;
  },

  // Register
  async register(email: string, password: string, name: string): Promise<User> {
    await delay(1000);
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser: User = {
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

  // Logout
  async logout(): Promise<void> {
    await delay(300);
    currentUser = null;
    localStorage.removeItem('camcine_user');
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem('camcine_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
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

  // Update subscription
  async updateSubscription(userId: string, subscription: SubscriptionType): Promise<User> {
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

  // Update preferences
  async updatePreferences(userId: string, preferences: Partial<User['preferences']>): Promise<User> {
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

  // Check if user has access to content
  async checkContentAccess(userId: string, contentId: string): Promise<boolean> {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return false;
    
    // Premium users have access to everything
    if (user.subscription === 'premium' || user.subscription === 'family') {
      return true;
    }
    
    // Free users only have access to free content
    // This would check the content status in real implementation
    return true;
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }
    // In real implementation, send reset email
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await delay(800);
    // In real implementation, validate token and update password
  },
};
