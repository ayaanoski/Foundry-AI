import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Copy, Check, RotateCcw, Palette } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateContent } from '../services/aiService';
import { formatPrompt } from '../utils/formatPrompt';
import BrandKitDisplay from './BrandKitDisplay';

interface FormData {
  productName: string;
  productDescription: string;
}

interface BrandKitGeneratorProps {
  onAddToHistory: (item: { productName: string; contentType: string; content: string; pageType: 'brand-kit' }) => void;
  onBack: () => void;
}

const BrandKitGenerator: React.FC<BrandKitGeneratorProps> = ({ onAddToHistory, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: ''
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.productDescription) return;

    setIsLoading(true);
    
    try {
      const prompt = formatPrompt(formData.productName, formData.productDescription, 'brand-kit');
      const content = await generateContent(prompt);
      
      setGeneratedContent(content);
      
      onAddToHistory({
        productName: formData.productName,
        contentType: 'brand-kit',
        content: content,
        pageType: 'brand-kit'
      });
      
      toast.success('Brand kit generated successfully!');
    } catch (error) {
      console.error('Error generating brand kit:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate brand kit. Please try again.');
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
            <h2 className="text-4xl font-bold text-white mb-4">Brand Kit Generator</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Create a comprehensive brand foundation including colors, voice, target audience, 
              and marketing strategy. Everything you need to build a strong brand identity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl h-fit"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Brand Details</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="productName" className="block text-white/80 mb-2 font-semibold">
                    Brand/Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                    placeholder="Enter your brand name..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productDescription" className="block text-white/80 mb-2 font-semibold">
                    Brand Description
                  </label>
                  <textarea
                    id="productDescription"
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    rows={6}
                    className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors resize-none"
                    placeholder="Describe your brand, target market, values, and what makes you unique..."
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || !formData.productName || !formData.productDescription}
                  className="w-full bg-gradient-to-r from-white to-white/90 text-black py-4 rounded-lg font-bold text-lg hover:from-white/90 hover:to-white/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Brand Kit...
                    </>
                  ) : (
                    <>
                      <Palette className="w-5 h-5 mr-2" />
                      Generate Brand Kit
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
              className="lg:col-span-3"
            >
              {generatedContent ? (
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Your Brand Kit</h3>
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
                            Copy All
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <BrandKitDisplay content={generatedContent} />
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] shadow-2xl flex items-center justify-center min-h-[600px]">
                  <div className="text-center">
                    <Palette className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">Your brand kit will appear here</p>
                    <p className="text-white/40">Fill out the form and click generate to create your complete brand identity</p>
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

export default BrandKitGenerator;