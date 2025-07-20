import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy, Check, RotateCcw, Palette } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateContent } from '../services/aiService';
import { formatPrompt } from '../utils/formatPrompt';
import BrandKitDisplay from './BrandKitDisplay'; // This will be our new Bento Grid display
import { parseBrandKit, BrandKitData } from '../utils/parseBrandKit'; // We will create this parser

// Interfaces
interface FormData {
  productName: string;
  productDescription: string;
}

interface BrandKitGeneratorProps {
  onAddToHistory: (item: { productName: string; contentType: string; content: string; pageType: 'brand-kit' }) => void;
  onBack: () => void;
}

// Main Component
const BrandKitGenerator: React.FC<BrandKitGeneratorProps> = ({ onAddToHistory }) => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: ''
  });
  const [rawContent, setRawContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // NEW: Parsed brand kit data state
  const parsedBrandKit = useMemo<BrandKitData | null>(() => {
    if (!rawContent) return null;
    return parseBrandKit(rawContent);
  }, [rawContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.productDescription) return;

    setIsLoading(true);
    setRawContent('');

    try {
      const prompt = formatPrompt(formData.productName, formData.productDescription, 'brand-kit');
      const content = await generateContent(prompt);
      
      setRawContent(content);
      
      onAddToHistory({
        productName: formData.productName,
        contentType: 'brand-kit',
        content: content,
        pageType: 'brand-kit'
      });
      
      toast.success('Brand kit generated successfully!');
    } catch (error) {
      console.error('Error generating brand kit:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate brand kit.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Brand Kit Generator</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Instantly generate a complete brand identity. From color palettes and typography to marketing strategies, get everything you need to build a memorable brand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Form Section (Sticky on Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 lg:sticky lg:top-24"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm h-full">
                <h3 className="text-2xl font-bold text-white mb-6">Brand Details</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="productName" className="block text-white/80 mb-2 font-semibold">Brand/Product Name</label>
                    <input
                      type="text"
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="e.g., Quantum Sneakers"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="productDescription" className="block text-white/80 mb-2 font-semibold">Brand Description</label>
                    <textarea
                      id="productDescription"
                      value={formData.productDescription}
                      onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                      rows={6}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                      placeholder="Describe your brand, target market, values..."
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !formData.productName || !formData.productDescription}
                    className="w-full bg-white text-black py-4 rounded-lg font-bold text-lg hover:bg-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/>Generating...</> : <><Palette className="w-5 h-5 mr-2"/>Generate Brand Kit</>}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              {parsedBrandKit && !isLoading ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Your Brand Kit</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={handleRegenerate} disabled={isLoading} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-50" title="Regenerate"><RotateCcw className="w-5 h-5"/></button>
                      <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        {copied ? <Check className="w-5 h-5 text-green-400"/> : <Copy className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>
                  <BrandKitDisplay kit={parsedBrandKit} />
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center min-h-[600px] p-6 backdrop-blur-sm">
                  <div className="text-center">
                    {isLoading ? (
                        <>
                            <Loader2 className="w-16 h-16 text-white/30 mx-auto mb-4 animate-spin"/>
                            <p className="text-white/60 text-lg">Building your brand...</p>
                            <p className="text-white/40">This might take a moment.</p>
                        </>
                    ) : (
                        <>
                            <Palette className="w-16 h-16 text-white/30 mx-auto mb-4" />
                            <p className="text-white/60 text-lg">Your brand kit will appear here</p>
                            <p className="text-white/40">Fill out the form to create your brand identity.</p>
                        </>
                    )}
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