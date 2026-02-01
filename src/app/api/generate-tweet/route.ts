import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const stylePrompts = {
  witty: 'Create a funny, witty tweet that would make people laugh and want to share. Use humor and clever wordplay.',
  professional: 'Create a professional, insightful tweet that demonstrates expertise and thought leadership.',
  inspirational: 'Create an inspiring, motivational tweet that uplifts and encourages people to take action.',
  controversial: 'Create a thought-provoking tweet that challenges common thinking while remaining respectful.',
  educational: 'Create an informative tweet that teaches something valuable in an engaging way.',
  storytelling: 'Create a narrative tweet that tells a compelling mini-story or shares an interesting anecdote.'
}

export async function POST(req: NextRequest) {
  try {
    const { topic, style, includeHashtags } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const stylePrompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.witty

    const prompt = `${stylePrompt}

Topic: ${topic}

Requirements:
- Keep it under 280 characters
- Make it engaging and shareable
- ${includeHashtags ? 'Include 2-3 relevant hashtags at the end' : 'Do not include hashtags'}
- Focus on high engagement potential

Tweet:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a viral tweet writer who creates engaging, shareable content. Always return just the tweet text without quotes or extra formatting.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.9,
    })

    const tweetText = completion.choices[0]?.message?.content?.trim() || ''
    
    // Extract hashtags if present
    const hashtagRegex = /#\\w+/g
    const hashtags = tweetText.match(hashtagRegex) || []
    
    return NextResponse.json({
      tweet: tweetText,
      hashtags: hashtags
    })

  } catch (error) {
    console.error('Error generating tweet:', error)
    return NextResponse.json(
      { error: 'Failed to generate tweet' },
      { status: 500 }
    )
  }
}"