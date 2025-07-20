// Define the structure for the analysis response
interface ImageAnalysisResponse {
  enhancedDescription: string;
  keyFeatures: string[];
  targetAudience: string;
  uniqueSellingPoints: string[];
}

/**
 * Analyzes product images using a vision AI model to generate marketing insights.
 * @param images - An array of base64 or URL strings for the product images.
 * @returns A promise that resolves to an ImageAnalysisResponse object.
 */
export const analyzeProductImages = async (images: string[]): Promise<ImageAnalysisResponse> => {
  const apiKey = import.meta.env.VITE_IO_INTELLIGENCE_API_KEY;

  if (!apiKey) {
    console.error('API key not configured.');
    throw new Error('API key not configured. Please add VITE_IO_INTELLIGENCE_API_KEY to your .env file.');
  }

  try {
    // Prepare the content array with a more robust prompt and the images
    const content: any[] = [
      {
        type: "text",
        // The prompt is refined to be more direct and enforce the JSON-only output rule.
        text: `Analyze the following product images. Your task is to provide a concise marketing analysis.
        
        Respond ONLY with a single, valid JSON object. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.
        
        The JSON object must have the following structure:
        - enhancedDescription: string (A compelling 2-3 sentence product description)
        - keyFeatures: string[] (An array of key visual features)
        - targetAudience: string (A description of the ideal customer)
        - uniqueSellingPoints: string[] (An array of selling points visible in the images)`
      }
    ];

    // Add each image to the content array
    images.forEach(imageData => {
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
          // The system prompt is enhanced to reinforce the expected output format.
          content: "You are an expert product analyst and marketing specialist. Your sole function is to analyze product images and return the analysis as a single, valid JSON object, adhering strictly to the user's requested format. Do not add any extra commentary."
        },
        {
          role: "user",
          content: content
        }
      ],
      // **CRITICAL FIX**: Enabling JSON mode forces the model to output valid JSON.
      // This is the most reliable way to prevent parsing errors.
      response_format: { type: "json_object" },
      max_tokens: 1024, // Increased slightly to ensure enough space for detailed responses
      temperature: 0.5 // Lowered slightly for more consistent and factual JSON output
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
      // Improved error logging to capture more details from the failed API response.
      const errorBody = await response.text();
      throw new Error(`AI API request failed: ${response.status} ${response.statusText}. Response: ${errorBody}`);
    }

    const result = await response.json();
    const aiMessage = result.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('AI analysis returned an empty response.');
    }

    // **CRITICAL FIX**: The parsing logic is now safer and more informative.
    let analysis: ImageAnalysisResponse;
    try {
      // With `response_format: { type: "json_object" }`, the response should be a clean JSON string.
      analysis = JSON.parse(aiMessage);
    } catch (parseError) {
      // If parsing fails (which is now unlikely), log the raw response and throw a specific error.
      // This avoids silently failing and returning incorrect, generic data.
      console.error('Failed to parse AI response as JSON.', {
        error: parseError,
        rawResponse: aiMessage,
      });
      throw new Error('The AI returned a response that was not in the expected JSON format.');
    }

    // The final validation is kept as a safeguard but is less likely to be needed.
    return {
      enhancedDescription: analysis.enhancedDescription || "No description provided.",
      keyFeatures: Array.isArray(analysis.keyFeatures) && analysis.keyFeatures.length > 0 ? analysis.keyFeatures : ["Not specified"],
      targetAudience: analysis.targetAudience || "Not specified",
      uniqueSellingPoints: Array.isArray(analysis.uniqueSellingPoints) && analysis.uniqueSellingPoints.length > 0 ? analysis.uniqueSellingPoints : ["Not specified"]
    };

  } catch (error) {
    console.error('An unexpected error occurred during image analysis:', error);
    // Re-throw the error to be handled by the calling function.
    throw error;
  }
};