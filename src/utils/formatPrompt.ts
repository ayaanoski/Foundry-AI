export const formatPrompt = (productName: string, productDescription: string, contentType: string): string => {
  const prompts = {
    'facebook-ad': `
Product: "${productName}"
Description: ${productDescription}

---
**Task:** Generate 3 to 5 high-impact ad headlines.

**Rules:**
1.  **Format:** Your response must ONLY be a numbered list of the headlines.
2.  **Content:** Each headline must be attention-grabbing, under 40 characters, and focus on a clear benefit.
3.  **No Extras:** Do not include any explanations, commentary, titles, or any text other than the numbered list itself.

**Headlines:**
`,

    'instagram-caption': `
Product Name: "${productName}"
Product Description: "${productDescription}"

---
**Task:** Generate a single, complete, ready-to-use Instagram caption.

**Rules:**
1.  **Output Format:** Your entire response MUST be ONLY the text for the caption. Do not include headers, titles like "## Option 1", or any other markdown formatting.
2.  **No Questions:** Do not ask any follow-up questions. Your output must be final.
3.  **Single Option:** Provide only ONE final caption, not multiple choices or variations.
4.  **Content Style:** The caption must be conversational, engaging, include relevant hashtags, and have a clear call-to-action.
5.  **Length:** Keep the caption between 50 and 150 words.

**Caption Text:**
`,

// Inside formatPrompt.ts

    'cold-email': `
Product: "${productName}"
Description: ${productDescription}

---
**Task:** Write a single, complete cold outreach email that is ready to send.

**Rules:**
1.  **Format:** Your response must ONLY contain the subject and body, structured exactly like this, including the blank lines for spacing:
    Subject: [Your Subject Here]
    Body: 
    [Greeting, e.g., Hi [Name],]

    [Main body paragraph 1: Address the recipient's pain point and introduce the product as a solution.]

    [Main body paragraph 2: Clearly state the value proposition and include a single, clear call-to-action.]

    [Closing, e.g., Best regards,]
    [Your Name or Brand Name]
2.  **Content:** The email must be professional, personalized, and compelling.
3.  **Length:** The email body must be under 150 words.
4.  **No Extras:** Do not include any options, questions, explanations, or any text outside the specified Subject/Body format.

**Email:**
`,

// ... other prompts,

    'landing-page': `
Product: "${productName}"
Description: ${productDescription}

---
**Task:** Write the copy for a complete landing page hero section.

**Rules:**
1.  **Structure:** Use markdown headers (\`###\`) for each section title. The required sections are: Headline, Subheadline, Key Benefits, Social Proof, Call to Action, and Urgency Element.
2.  **Content:** For the "Key Benefits" section, you must use a bulleted list.
3.  **Output:** Deliver ONLY the requested content formatted with markdown. Do not write any introductions, explanations, or any text outside of the defined structure.

**Landing Page Copy:**
`,

    'brand-kit': `
Product Name: "${productName}"
Description: "${productDescription}"

---
**Task:** Create a comprehensive brand kit. Replace all content inside [square brackets] with your generated response.

**Rules:**
1.  **Format:** You must follow the specified structure precisely, using markdown headers (\`###\`) for main sections and bolded sub-headers (\`**Sub-header:**\`) for list items.
2.  **Completeness:** You must fill out every single requested section. Do not skip any.
3.  **Output:** Your entire response must be ONLY the brand kit content. Avoid all introductory text, explanations, or conversational filler.

**Brand Kit:**

### 🎨 BRAND THEME & MOOD
- **Keywords:** [Provide 5-7 descriptive keywords as a comma-separated list]
- **Visual Style:** [Describe the visual direction in one sentence]
- **Personality:** [List 3-4 key brand personality traits as a comma-separated list]

### 🎯 TARGET AUDIENCE
- **Demographic:** [Describe the primary audience]
- **Pain Points:** [List 2-3 primary pain points of the audience]
- **Hangouts:** [List 3-4 key places the audience can be found online/offline]

### 🎨 COLOR PALETTE
- **Primary:** [Hex code and a name/description]
- **Secondary:** [Hex code and a name/description]
- **Accent:** [Hex code and a name/description]
- **Neutrals:** [Provide 2 hex codes for neutral colors]
- **Psychology:** [Briefly explain the psychology of the primary color choice in one sentence]

### 🧾 BRAND VOICE & TONE
- **Style:** [Describe the communication style in 3-4 keywords]
- **Pillars:** [List 2-3 key messaging pillars]
- **Vocabulary to Use:** [Provide 5-7 powerful words to use]
- **Vocabulary to Avoid:** [Provide 5-7 words to avoid]

### 🗣️ TAGLINE SUGGESTIONS
- [Provide 3 distinct taglines, under 8 words each, on new lines]

### 📢 MARKETING STRATEGIES
- **Online:** [Provide 2-3 online marketing ideas]
- **Offline:** [Provide 2 offline marketing or partnership ideas]
`
  };

  // Return the requested prompt, or a safe default if the key doesn't exist.
  return prompts[contentType as keyof typeof prompts] || prompts['facebook-ad'];
};