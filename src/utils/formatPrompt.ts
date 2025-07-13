export const formatPrompt = (productName: string, productDescription: string, contentType: string): string => {
  const prompts = {
    'facebook-ad': `Product: "${productName}"

Description: ${productDescription}

Generate 3-5 Facebook/Google ad headlines that are:
- Attention-grabbing and click-worthy
- Under 40 characters each
- Focused on benefits and results
- Include emotional triggers

Format as numbered list.`,

    'instagram-caption': `Product: "${productName}"

Description: ${productDescription}

Instagram caption:
- Conversational and authentic
- Include relevant hashtags
- Clear call-to-action
- Engaging and shareable
- Around 150–200 words
- No introductory fluff or explanations
`,

    'cold-email': `Write a cold outreach email for "${productName}".

Product Description: ${productDescription}

The email should be:
- Personalized and professional
- Address a specific pain point
- Include a clear value proposition
- Have a compelling subject line
- End with a specific call-to-action
- Keep it under 150 words`,

    'landing-page': `Product: "${productName}"

Description: ${productDescription}

Landing page content:
- Headline
- Subheadline
- 3–4 key benefits
- Social proof statement
- Clear call-to-action
- Urgency or scarcity element

Write in complete landing page format without intros or explanations.`,

    'brand-kit': `Product: "${productName}"

Description: ${productDescription}

Create a brand kit with the following:

🎨 BRAND THEME & MOOD
- 5–7 descriptive keywords
- Visual style direction
- Brand personality traits

🎯 TARGET AUDIENCE
- Primary demographic
- Pain points and motivations
- Online/offline hangouts

🎨 COLOR PALETTE
- Primary color (hex)
- Secondary color (hex)
- Accent color (hex)
- Neutral colors (2–3 with hex)
- Brief color psychology

🧾 BRAND VOICE & TONE
- Communication style
- Key messaging pillars
- Words to use vs. avoid

🗣️ TAGLINE SUGGESTIONS
- 3–5 taglines (under 8 words)
- Focused on benefits/emotion

📢 MARKETING STRATEGIES
Online:
- 3–4 channels
- Content strategy
- Social media approach

Offline:
- 2–3 marketing ideas
- Partnerships
- Event concepts

Avoid intro explanations — deliver only the requested content in structured format.`
  };

  return prompts[contentType as keyof typeof prompts] || prompts['facebook-ad'];
};
