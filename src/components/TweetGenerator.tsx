'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, RefreshCw, Hash, Sparkles, Zap, Heart, MessageSquare, Brain } from 'lucide-react'
import toast from 'react-hot-toast'

interface TweetGeneratorProps {
  user: any
  dailyTweetsUsed: number
  onTweetGenerated: () => void
}

const tweetStyles = [
  { id: 'witty', name: 'Witty', icon: '😄', color: 'from-yellow-400 to-orange-500' },
  { id: 'professional', name: 'Professional', icon: '👔', color: 'from-blue-400 to-blue-600' },
  { id: 'inspirational', name: 'Inspirational', icon: '✨', color: 'from-purple-400 to-pink-500' },
  { id: 'controversial', name: 'Controversial', icon: '🔥', color: 'from-red-400 to-red-600' },
  { id: 'educational', name: 'Educational', icon: '🎓', color: 'from-green-400 to-teal-500' },
  { id: 'storytelling', name: 'Story', icon: '📖', color: 'from-indigo-400 to-purple-600' },
]

export default function TweetGenerator({ user, dailyTweetsUsed, onTweetGenerated }: TweetGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('witty')
  const [generatedTweet, setGeneratedTweet] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [includeHashtags, setIncludeHashtags] = useState(true)

  const canGenerate = user?.isPro || dailyTweetsUsed < 3

  const generateTweet = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic first!')
      return
    }

    if (!canGenerate) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited tweets.')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style: selectedStyle, includeHashtags }),
      })

      const data = await response.json()
      
      if (data.error) {
        toast.error(data.error)
        return
      }

      setGeneratedTweet(data.tweet)
      setHashtags(data.hashtags || [])
      onTweetGenerated()
      toast.success('Tweet generated successfully!')
    } catch (error) {
      toast.error('Failed to generate tweet. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    const fullTweet = includeHashtags && hashtags.length > 0 
      ? `${generatedTweet}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`
      : generatedTweet
    
    navigator.clipboard.writeText(fullTweet)
    toast.success('Tweet copied to clipboard!')
  }

  return (
    <section className="px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What do you want to tweet about?
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., AI technology, morning coffee, productivity tips..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && generateTweet()}
              />
              <Brain className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Choose your tweet style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tweetStyles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`tweet-style-button ${
                    selectedStyle === style.id
                      ? `bg-gradient-to-r ${style.color} text-white border-transparent`
                      : 'bg-white/10 text-gray-300 border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="mr-2">{style.icon}</span>
                  {style.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">
                <Hash className="inline w-4 h-4 mr-1" />
                Include relevant hashtags
              </span>
            </label>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateTweet}
            disabled={isGenerating || !canGenerate}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              canGenerate
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Tweet
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Generated Tweet Display */}
        <AnimatePresence>
          {generatedTweet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Generated Tweet</h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={generateTweet}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyToClipboard}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-white whitespace-pre-wrap">{generatedTweet}</p>
                  {includeHashtags && hashtags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Engagement Preview */}
                <div className="flex items-center gap-6 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>2.5k</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>128</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>543</span>
                  </div>
                  <span className="ml-auto text-xs">Engagement preview</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}