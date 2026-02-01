import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TweetCraft AI - Generate Viral Tweets with AI',
  description: 'Create engaging, viral-worthy tweets in seconds. Perfect for content creators, marketers, and social media managers.',
  keywords: 'AI tweet generator, viral tweets, social media tool, content creation',
  openGraph: {
    title: 'TweetCraft AI - Generate Viral Tweets with AI',
    description: 'Create engaging tweets that drive engagement',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900`}>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}