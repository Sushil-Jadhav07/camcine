// Camcine - Payment Service (Mock API)
import type { Purchase, SubscriptionPlan } from '@/types';
import { mockPurchases, mockSubscriptionPlans } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  // Get subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    await delay(400);
    return mockSubscriptionPlans;
  },

  // Get plan by ID
  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    await delay(300);
    return mockSubscriptionPlans.find(p => p.id === planId) || null;
  },

  // Create subscription
  async createSubscription(
    userId: string, 
    planId: string, 
    paymentMethod: string
  ): Promise<Purchase> {
    await delay(1000);
    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const purchase: Purchase = {
      id: `purchase-${Date.now()}`,
      userId,
      contentId: planId,
      type: 'subscription',
      amount: plan.price,
      status: 'completed',
      paymentMethod,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    mockPurchases.push(purchase);
    return purchase;
  },

  // Purchase content
  async purchaseContent(
    userId: string,
    contentId: string,
    type: 'rental' | 'purchase' | 'episode',
    amount: number,
    paymentMethod: string,
    episodeId?: string
  ): Promise<Purchase> {
    await delay(1000);
    
    const purchase: Purchase = {
      id: `purchase-${Date.now()}`,
      userId,
      contentId,
      episodeId,
      type,
      amount,
      status: 'completed',
      paymentMethod,
      createdAt: new Date(),
      expiresAt: type === 'rental' ? new Date(Date.now() + 48 * 60 * 60 * 1000) : undefined,
    };

    mockPurchases.push(purchase);
    return purchase;
  },

  // Process payment (mock Razorpay)
  async processPayment(
    amount: number,
    currency: string = 'INR',
    description: string
  ): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
  }> {
    await delay(1500);
    
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        message: 'Payment successful',
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  },

  // Get purchase history
  async getPurchaseHistory(userId: string): Promise<Purchase[]> {
    await delay(400);
    return mockPurchases.filter(p => p.userId === userId);
  },

  // Get purchase by ID
  async getPurchaseById(purchaseId: string): Promise<Purchase | null> {
    await delay(300);
    return mockPurchases.find(p => p.id === purchaseId) || null;
  },

  // Cancel subscription
  async cancelSubscription(userId: string, purchaseId: string): Promise<void> {
    await delay(600);
    const purchase = mockPurchases.find(p => p.id === purchaseId);
    if (purchase) {
      purchase.status = 'refunded';
    }
  },

  // Check subscription status
  async checkSubscriptionStatus(userId: string): Promise<{
    isActive: boolean;
    plan?: SubscriptionPlan;
    expiresAt?: Date;
  }> {
    await delay(400);
    const purchase = mockPurchases.find(
      p => p.userId === userId && 
           p.type === 'subscription' && 
           p.status === 'completed' &&
           (!p.expiresAt || p.expiresAt > new Date())
    );

    if (purchase) {
      const plan = mockSubscriptionPlans.find(p => p.id === purchase.contentId);
      return {
        isActive: true,
        plan,
        expiresAt: purchase.expiresAt,
      };
    }

    return { isActive: false };
  },

  // Get payment methods
  async getPaymentMethods(userId: string): Promise<Array<{
    id: string;
    type: 'card' | 'upi' | 'wallet';
    last4?: string;
    brand?: string;
    isDefault: boolean;
  }>> {
    await delay(400);
    return [
      { id: 'pm-1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
      { id: 'pm-2', type: 'upi', isDefault: false },
    ];
  },

  // Add payment method
  async addPaymentMethod(
    userId: string,
    method: { type: string; details: Record<string, string> }
  ): Promise<void> {
    await delay(600);
    // In real implementation, save payment method
  },

  // Remove payment method
  async removePaymentMethod(userId: string, methodId: string): Promise<void> {
    await delay(400);
    // In real implementation, remove payment method
  },

  // Get invoice
  async getInvoice(purchaseId: string): Promise<{
    id: string;
    amount: number;
    date: Date;
    description: string;
    status: string;
  } | null> {
    await delay(400);
    const purchase = mockPurchases.find(p => p.id === purchaseId);
    if (!purchase) return null;

    return {
      id: purchase.id,
      amount: purchase.amount,
      date: purchase.createdAt,
      description: 'Camcine Purchase',
      status: purchase.status,
    };
  },
};
