'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Zap } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

interface PricingSectionProps {
  onClose: () => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PricingSection({ onClose }: PricingSectionProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const { sessionId } = await response.json()
      const stripe = await stripePromise
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe error:', error)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=\"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4\"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className=\"bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full relative border border-white/10\"
      >
        <button
          onClick={onClose}
          className=\"absolute top-4 right-4 text-gray-400 hover:text-white\"
        >
          <X size={24} />
        </button>

        <div className=\"text-center mb-6\">
          <div className=\"inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4\">
            <Zap className=\"text-white\" size={32} />
          </div>
          <h2 className=\"text-2xl font-bold text-white mb-2\">
            Upgrade to Pro
          </h2>
          <p className=\"text-gray-400\">
            Unlimited AI-powered tweets for just $9.99/month
          </p>
        </div>

        <div className=\"space-y-3 mb-6\">
          {features.map((feature, index) => (
            <div key={index} className=\"flex items-center gap-3\">
              <Check className=\"text-green-400 flex-shrink-0\" size={20} />
              <span className=\"text-gray-300\">{feature}</span>
            </div>
          ))}
        </div>

        <div className=\"text-center mb-6\">
          <div className=\"text-3xl font-bold text-white\">$9.99</div>
          <div className=\"text-gray-400\">per month</div>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 
            ${isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25'
            }`}
        >
          {isLoading ? 'Processing...' : 'Upgrade Now'}
        </button>

        <p className=\"text-xs text-gray-500 text-center mt-4\">
          Cancel anytime. No questions asked.
        </p>
      </motion.div>
    </motion.div>
  )
}

const features = [
  'Unlimited tweet generation',
  'All 6 premium styles',
  'Priority AI processing',
  'Advanced hashtag optimization',
  'Export to scheduling tools',
  '24/7 support'
]"