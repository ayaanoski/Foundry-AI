import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateContent } from '../services/aiService';
import { formatPrompt } from '../utils/formatPrompt';
import FormattedContent from './FormattedContent';

interface FormData {
  productName: string;
  productDescription: string;
  contentType: string;
}

interface CopyGeneratorProps {
  onAddToHistory: (item: { productName: string; contentType: string; content: string; pageType: 'copy-generator' }) => void;
  onBack: () => void;
}

const CopyGenerator: React.FC<CopyGeneratorProps> = ({ onAddToHistory }) => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    contentType: 'facebook-ad'
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { value: 'facebook-ad', label: 'Facebook/Google Ad Headlines' },
    { value: 'instagram-caption', label: 'Instagram Captions' },
    { value: 'cold-email', label: 'Cold Outreach Emails' },
    { value: 'landing-page', label: 'Landing Page Copy' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.productDescription) return;

    setIsLoading(true);
    
    try {
      const prompt = formatPrompt(formData.productName, formData.productDescription, formData.contentType);
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
            <h2 className="text-4xl font-bold text-white mb-4">Copy Generator</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Generate high-converting marketing copy for your products and services. 
              Perfect for ads, social media, emails, and landing pages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl h-fit"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Product Details</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="productName" className="block text-white/80 mb-2 font-semibold">
                    Product Name
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
                    Product Description
                  </label>
                  <textarea
                    id="productDescription"
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    rows={4}
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
                  disabled={isLoading || !formData.productName || !formData.productDescription}
                  className="w-full bg-white text-black py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Generate Copy
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {generatedContent ? (
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Generated Copy</h3>
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
                  </div>

                  <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#404040]">
                    <FormattedContent content={generatedContent} />
                  </div>
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Send className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">Your generated copy will appear here</p>
                    <p className="text-white/40">Fill out the form and click generate to get started</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyGenerator;