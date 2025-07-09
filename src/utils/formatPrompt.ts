export const formatPrompt = (productName: string, productDescription: string, contentType: string): string => {
  const prompts = {
    'facebook-ad': `Create compelling Facebook/Google ad headlines for "${productName}". 

Product Description: ${productDescription}

Generate 3-5 different headlines that are:
- Attention-grabbing and click-worthy
- Under 40 characters each
- Focused on benefits and results
- Include emotional triggers

Format as numbered list.`,

    'instagram-caption': `Write an engaging Instagram caption for "${productName}".

Product Description: ${productDescription}

The caption should be:
- Conversational and authentic
- Include relevant hashtags
- Have a clear call-to-action
- Be engaging and shareable
- Around 150-200 words`,

    'cold-email': `Write a cold outreach email for "${productName}".

Product Description: ${productDescription}

The email should be:
- Personalized and professional
- Address a specific pain point
- Include a clear value proposition
- Have a compelling subject line
- End with a specific call-to-action
- Keep it under 150 words`,

    'landing-page': `Create compelling landing page copy for "${productName}".

Product Description: ${productDescription}

Include:
- Powerful headline
- Subheadline
- 3-4 key benefits
- Social proof statement
- Clear call-to-action
- Urgency/scarcity element

Structure it as a complete landing page flow.`,

    'brand-kit': `Generate a complete brand kit for "${productName}".

Product Description: ${productDescription}

Create a comprehensive branding foundation including:

🎨 BRAND THEME & MOOD
- 5-7 descriptive keywords that capture the brand essence
- Visual style direction (modern, vintage, minimalist, bold, etc.)
- Brand personality traits

🎯 TARGET AUDIENCE
- Primary demographic (age, gender, income, lifestyle)
- Pain points and motivations
- Where they spend time (online/offline)

🎨 COLOR PALETTE
- Primary color with hex code
- Secondary color with hex code  
- Accent color with hex code
- Neutral colors (2-3) with hex codes
- Brief explanation of color psychology

🧾 BRAND VOICE & TONE
- Communication style (professional, casual, friendly, authoritative)
- Key messaging pillars (3-4 main themes)
- Words to use vs. avoid

🗣️ TAGLINE SUGGESTIONS
- 3-5 memorable tagline options
- Each under 8 words
- Focus on benefits and emotion

📢 MARKETING STRATEGIES
Online:
- 3-4 digital marketing channels
- Content strategy suggestions
- Social media approach

Offline:
- 2-3 traditional marketing ideas
- Partnership opportunities
- Event/experiential concepts

Format with clear sections and emojis for visual appeal.`
  };

  return prompts[contentType as keyof typeof prompts] || prompts['facebook-ad'];
};