'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import TweetGenerator from '@/components/TweetGenerator'
import PricingSection from '@/components/PricingSection'
import { useUser } from '@/lib/useUser'

export default function Home() {
  const { user, isLoading } = useUser()
  const [dailyTweetsUsed, setDailyTweetsUsed] = useState(0)
  const [showPricing, setShowPricing] = useState(false)

  useEffect(() => {
    // Check daily usage from localStorage
    const today = new Date().toDateString()
    const usage = localStorage.getItem(`tweets_${today}`)
    if (usage) {
      setDailyTweetsUsed(parseInt(usage))
    }
  }, [])

  const handleTweetGenerated = () => {
    const today = new Date().toDateString()
    const newUsage = dailyTweetsUsed + 1
    setDailyTweetsUsed(newUsage)
    localStorage.setItem(`tweets_${today}`, newUsage.toString())

    if (newUsage >= 3 && !user?.isPro) {
      setShowPricing(true)
      toast.error('Daily free limit reached! Upgrade to Pro for unlimited tweets.')
    }
  }

  return (
    <main className="min-h-screen">
      <Header user={user} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">TweetCraft AI</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Generate viral-worthy tweets in seconds with AI
            </p>
            
            {!user?.isPro && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
                <span className="text-yellow-400">⚡</span>
                <span className="text-white">
                  {3 - dailyTweetsUsed} free tweets left today
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tweet Generator */}
      <TweetGenerator 
        user={user}
        dailyTweetsUsed={dailyTweetsUsed}
        onTweetGenerated={handleTweetGenerated}
      />

      {/* Pricing Modal */}
      {showPricing && (
        <PricingSection onClose={() => setShowPricing(false)} />
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why TweetCraft AI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect p-6 rounded-xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const features = [
  {
    icon: "🚀",
    title: "Instant Generation",
    description: "Get tweet ideas in seconds, not hours. AI-powered creativity at your fingertips."
  },
  {
    icon: "🎯",
    title: "Multiple Styles",
    description: "From witty to professional, choose the perfect tone for your audience."
  },
  {
    icon: "📈",
    title: "Engagement Optimized",
    description: "Trained on viral tweets to maximize likes, retweets, and replies."
  }
]