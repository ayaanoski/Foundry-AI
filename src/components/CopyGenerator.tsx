import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  Loader2, Copy, Check, RotateCcw, Sparkles, Brain } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateContent } from '../services/aiService';
import { analyzeProductImages } from '../services/ImageAnalysisService';
import { formatPrompt } from '../utils/formatPrompt';
import FormattedContent from './FormattedContent';
import ImageUpload from './ImageUpload';
import InstagramPreview from './previews/InstagramPreview';
import FacebookPreview from './previews/FacebookPreview';
import GmailPreview from './previews/GmailPreview';

interface FormData {
  productName: string;
  productDescription: string;
  contentType: string;
  images: string[];
}

interface CopyGeneratorProps {
  onAddToHistory: (item: { productName: string; contentType: string; content: string; pageType: 'copy-generator' }) => void;
  onBack: () => void;
}

const CopyGenerator: React.FC<CopyGeneratorProps> = ({ onAddToHistory, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    contentType: 'facebook-ad',
    images: []
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const contentTypes = [
    { value: 'facebook-ad', label: 'Facebook/Google Ad Headlines' },
    { value: 'instagram-caption', label: 'Instagram Captions' },
    { value: 'cold-email', label: 'Cold Outreach Emails' },
    { value: 'landing-page', label: 'Landing Page Copy' }
  ];

  const handleImagesChange = async (images: string[]) => {
    setFormData({ ...formData, images });
    
    // If we have images, analyze them
    if (images.length > 0) {
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeProductImages(images);
        setAiAnalysis(analysis);
        
        // Auto-fill or enhance the description with AI analysis
        const enhancedDescription = analysis.enhancedDescription + 
          (formData.productDescription ? ` ${formData.productDescription}` : '');
        
        setFormData(prev => ({
          ...prev,
          productDescription: enhancedDescription,
          images
        }));
        
        toast.success('Images analyzed successfully! Description enhanced with AI insights.');
      } catch (error) {
        console.error('Image analysis failed:', error);
        toast.error('Image analysis failed, but you can still proceed manually.');
        setFormData(prev => ({ ...prev, images }));
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setAiAnalysis(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.productDescription) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create enhanced prompt with AI analysis if available
      let enhancedDescription = formData.productDescription;
      
      if (aiAnalysis) {
        enhancedDescription += `\n\nAI Visual Analysis:
- Key Features: ${aiAnalysis.keyFeatures.join(', ')}
- Target Audience: ${aiAnalysis.targetAudience}
- Unique Selling Points: ${aiAnalysis.uniqueSellingPoints.join(', ')}`;
      }

      const prompt = formatPrompt(formData.productName, enhancedDescription, formData.contentType);
      const content = await generateContent(prompt);
      
      setGeneratedContent(content);
      
      onAddToHistory({
        productName: formData.productName,
        contentType: formData.contentType,
        content: content,
        pageType: 'copy-generator'
      });
      
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    handleSubmit(new Event('submit') as any);
  };

  const renderPreview = () => {
    if (!generatedContent || formData.images.length === 0) return null;

    switch (formData.contentType) {
      case 'instagram-caption':
        return (
          <InstagramPreview 
            images={formData.images}
            caption={generatedContent}
            username={formData.productName.toLowerCase().replace(/\s+/g, '_')}
          />
        );
      case 'facebook-ad':
        return (
          <FacebookPreview 
            images={formData.images}
            content={generatedContent}
            pageName={formData.productName}
          />
        );
      case 'cold-email':
        return (
          <GmailPreview 
            content={generatedContent}
            productName={formData.productName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Copy Generator</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Upload product images for AI analysis, then generate high-converting marketing copy 
              tailored to your product's visual features and appeal.
            </p>
          </motion.div>

          {/* Query and Response Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl h-fit"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Product Details</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  maxImages={4}
                  isAnalyzing={isAnalyzing}
                />

                {/* AI Analysis Display */}
                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#2a2a2a] rounded-lg p-4 border border-[#404040]"
                  >
                    <div className="flex items-center mb-3">
                      <Brain className="w-5 h-5 text-blue-400 mr-2" />
                      <h4 className="text-white font-semibold">AI Visual Analysis</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">Target Audience:</span>
                        <span className="text-white/90 ml-2">{aiAnalysis.targetAudience}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Key Features:</span>
                        <span className="text-white/90 ml-2">{aiAnalysis.keyFeatures.join(', ')}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label htmlFor="productName" className="block text-white/80 mb-2 font-semibold">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                    placeholder="Enter your product name..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productDescription" className="block text-white/80 mb-2 font-semibold">
                    Product Description *
                    {aiAnalysis && (
                      <span className="text-blue-400 text-sm ml-2">(Enhanced with AI analysis)</span>
                    )}
                  </label>
                  <textarea
                    id="productDescription"
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    rows={6}
                    className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors resize-none"
                    placeholder="Describe your product in detail..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contentType" className="block text-white/80 mb-2 font-semibold">
                    Content Type
                  </label>
                  <select
                    id="contentType"
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                  >
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || isAnalyzing || !formData.productName || !formData.productDescription || formData.images.length === 0}
                  className="w-full bg-white text-black py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: (isLoading || isAnalyzing) ? 1 : 1.02 }}
                  whileTap={{ scale: (isLoading || isAnalyzing) ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      Analyzing Images...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Copy
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Response Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-2xl flex flex-col"
            >
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">AI-Generated Copy</h3>
                  {generatedContent && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRegenerate}
                        disabled={isLoading}
                        className="bg-[#2a2a2a] hover:bg-[#404040] text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCopy}
                        className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Scrollable Response Content */}
              <div className="flex-1 px-4 pb-2 overflow-y-auto">
                {generatedContent ? (
                  <div className="bg-[#2a2a2a] rounded-lg border border-[#404040] h-[710px] overflow-y-auto">
                    <div className="p-3">
                      <FormattedContent content={generatedContent} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#2a2a2a] rounded-lg border border-[#404040] h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60 text-lg">Your AI-generated copy will appear here</p>
                      <p className="text-white/40">Upload images and fill out the form to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Section - Full Width Below */}
          {generatedContent && formData.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Platform Preview</h3>
                <p className="text-white/60">See how your content will look on the actual platform</p>
              </div>
              
              <div className="flex justify-center">
                {renderPreview()}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyGenerator;