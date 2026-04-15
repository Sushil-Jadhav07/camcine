import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store';

const PLANS = [
  { id: 'free', name: 'Free', monthlyPrice: 0, annualPrice: 0, features: ['SD quality', '1 screen', 'Limited content', 'Ads included'], isPopular: false },
  { id: 'standard', name: 'Standard', monthlyPrice: 199, annualPrice: 1990, features: ['HD quality', '2 screens', 'Full content library', 'Ad-free experience', 'Downloads'], isPopular: false },
  { id: 'premium', name: 'Premium', monthlyPrice: 499, annualPrice: 4990, features: ['4K Ultra HD', '4 screens', 'All content', 'Ad-free experience', 'Downloads', 'Early access'], isPopular: true },
];

const FAQ_ITEMS = [
  { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing cycle.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, UPI, and net banking. Payment is processed securely.' },
  { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription anytime. You will retain access until the end of your billing period.' },
  { question: 'Is there a free trial?', answer: 'We offer a 7-day free trial for new subscribers. No credit card required.' },
  { question: 'How many devices can I watch on?', answer: 'It depends on your plan. Free: 1 device, Standard: 2 devices, Premium: 4 devices simultaneously.' },
];

export function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen py-12 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[40px] lg:text-[48px] font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
            Stream unlimited movies, shows, live news, and songs. Cancel anytime.
          </p>
        </div>

        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-3 p-1.5 glass rounded-full">
            <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setBillingCycle('annual')} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}>
              Annual
              <span className={`text-xs px-2 py-0.5 rounded-full ${billingCycle === 'annual' ? 'bg-white/20' : 'bg-red-500/20 text-red-400'}`}>Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            const isCurrentPlan = user?.subscription === plan.id;

            return (
              <div key={plan.id} className={`relative glass-card p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] ${plan.isPopular ? 'border-[var(--accent)] glow-accent' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>{plan.name}</h3>

                <div className="mb-8">
                  <span className="text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{formatPrice(price)}</span>
                  <span className="text-[var(--text-muted)] text-sm ml-1">/mo</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-[var(--accent)]/20 mt-0.5"><Check className="w-4 h-4 text-[var(--accent)]" /></div>
                      <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button className="w-full py-3.5 rounded-xl border-2 border-[var(--accent)] text-[var(--accent)] font-semibold cursor-default">Current Plan</button>
                ) : (
                  <Link to={isAuthenticated ? '#' : '/register'} className={`block w-full py-3.5 rounded-xl text-center font-semibold transition-all duration-300 ${plan.isPopular ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white hover:shadow-lg hover:shadow-[var(--accent)]/30' : 'btn-ghost w-full justify-center'}`}>
                    {plan.id === 'free' ? 'Get Started' : 'Subscribe'}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>Frequently Asked Questions</h2>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-white pr-4">{item.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5"><p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.answer}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
