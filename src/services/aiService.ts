interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateContent = async (prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_IO_INTELLIGENCE_API_KEY;
  const modelId = import.meta.env.VITE_IO_MODEL_ID || 'meta-llama/Llama-3.3-70B-Instruct';

  if (!apiKey) {
    throw new Error('API key not configured. Please add VITE_IO_INTELLIGENCE_API_KEY to your .env file.');
  }

  const messages: AIMessage[] = [
    { 
      role: 'system', 
      content: 'You are a world-class copywriter and brand strategist specializing in high-converting marketing copy and comprehensive brand development. Create compelling, persuasive content that drives action and builds strong brand identity.' 
    },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: AIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to generate content. Please check your API key and try again.');
  }
};