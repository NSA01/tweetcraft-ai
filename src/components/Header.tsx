import { motion } from 'framer-motion'
import { Sparkles, User } from 'lucide-react'

interface HeaderProps {
  user: any
  isLoading: boolean
}

export default function Header({ user, isLoading }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-bold text-white">TweetCraft AI</span>
        </motion.div>
        
        <nav className="flex items-center gap-6">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  {user.isPro && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-semibold rounded-full">
                      PRO
                    </span>
                  )}
                  <button className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user.email}</span>
                  </button>
                </div>
              ) : (
                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                  Sign In
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}