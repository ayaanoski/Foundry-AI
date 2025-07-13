interface ImageAnalysisResponse {
  enhancedDescription: string;
  keyFeatures: string[];
  targetAudience: string;
  uniqueSellingPoints: string[];
}

export const analyzeProductImages = async (images: string[]): Promise<ImageAnalysisResponse> => {
  const apiKey = import.meta.env.VITE_IO_INTELLIGENCE_API_KEY;

  if (!apiKey) {
    throw new Error('API key not configured. Please add VITE_IO_INTELLIGENCE_API_KEY to your .env file.');
  }

  try {
    // Prepare the content array with text and images
    const content = [
      {
        type: "text",
        text: `Analyze these product images and provide:
1. An enhanced, detailed product description (2-3 sentences)
2. Key visual features you can identify
3. Target audience based on the product appearance
4. Unique selling points visible in the images

Respond in JSON format with fields: enhancedDescription, keyFeatures (array), targetAudience (string), uniqueSellingPoints (array).
Focus on what makes this product appealing and marketable based on visual analysis.`
      }
    ];

    // Add each image to the content array
    images.forEach((imageData, index) => {
      content.push({
        type: "image_url",
        image_url: {
          url: imageData
        }
      });
    });

    const aiRequestBody = {
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct",
      messages: [
        {
          role: "system",
          content: "You are an expert product analyst and marketing specialist. Analyze product images to create compelling, accurate descriptions that highlight key features, benefits, and market appeal. Focus on visual elements, design quality, functionality, and target market positioning."
        },
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    };

    const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiRequestBody),
    });

    if (!response.ok) {
      throw new Error(`AI API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const aiMessage = result.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No response from AI analysis');
    }

    // Parse the JSON response
    let analysis: ImageAnalysisResponse;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiMessage.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiMessage;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      // Fallback parsing if JSON extraction fails
      analysis = {
        enhancedDescription: "A high-quality product with excellent design and functionality, perfect for discerning customers who value both style and performance.",
        keyFeatures: ["Premium quality", "Attractive design", "Functional features"],
        targetAudience: "Quality-conscious consumers",
        uniqueSellingPoints: ["Superior craftsmanship", "Distinctive design", "Excellent value"]
      };
    }

    // Validate and return the analysis
    return {
      enhancedDescription: analysis.enhancedDescription || "A premium product with exceptional quality and design.",
      keyFeatures: Array.isArray(analysis.keyFeatures) ? analysis.keyFeatures : ["High quality", "Great design"],
      targetAudience: analysis.targetAudience || "Quality-focused customers",
      uniqueSellingPoints: Array.isArray(analysis.uniqueSellingPoints) ? analysis.uniqueSellingPoints : ["Premium quality", "Unique design"]
    };

  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze images. Please try again.');
  }
};