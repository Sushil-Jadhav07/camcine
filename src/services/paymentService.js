// Camcine - Payment Service (Mock API)
import { mockPurchases, mockSubscriptionPlans } from '@/data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  async getSubscriptionPlans() {
    await delay(400);
    return mockSubscriptionPlans;
  },

  async getPlanById(planId) {
    await delay(300);
    return mockSubscriptionPlans.find(p => p.id === planId) || null;
  },

  async createSubscription(userId, planId, paymentMethod) {
    await delay(1000);
    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const purchase = {
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

  async purchaseContent(userId, contentId, type, amount, paymentMethod, episodeId) {
    await delay(1000);
    
    const purchase = {
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

  async processPayment(amount, currency = 'INR', description) {
    await delay(1500);
    
    const success = Math.random() > 0.1;
    
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

  async getPurchaseHistory(userId) {
    await delay(400);
    return mockPurchases.filter(p => p.userId === userId);
  },

  async getPurchaseById(purchaseId) {
    await delay(300);
    return mockPurchases.find(p => p.id === purchaseId) || null;
  },

  async cancelSubscription(userId, purchaseId) {
    await delay(600);
    const purchase = mockPurchases.find(p => p.id === purchaseId);
    if (purchase) {
      purchase.status = 'refunded';
    }
  },

  async checkSubscriptionStatus(userId) {
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

  async getPaymentMethods(userId) {
    await delay(400);
    return [
      { id: 'pm-1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
      { id: 'pm-2', type: 'upi', isDefault: false },
    ];
  },

  async addPaymentMethod(userId, method) {
    await delay(600);
  },

  async removePaymentMethod(userId, methodId) {
    await delay(400);
  },

  async getInvoice(purchaseId) {
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
