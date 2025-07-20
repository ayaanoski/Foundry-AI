import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy, Check, RotateCcw, Sparkles, Brain, Image as ImageIcon, FileText, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

// --- Replace with your actual imports ---
import { generateContent } from '../services/aiService';
import { analyzeProductImages } from '../services/ImageAnalysisService';
import { formatPrompt } from '../utils/formatPrompt';
import FormattedContent from './FormattedContent';
import ImageUpload from './ImageUpload';
import InstagramPreview from './previews/InstagramPreview';
import FacebookPreview from './previews/FacebookPreview';
import GmailPreview from './previews/GmailPreview';

// --- Interfaces ---
interface FormData {
  productName: string;
  productDescription: string;
  contentType: string;
  images: string[];
}

interface CopyGeneratorProps {
  onAddToHistory: (item: { productName:string; contentType: string; content: string; pageType: 'copy-generator' }) => void;
  onBack: () => void;
}

interface AIAnalysis {
    enhancedDescription: string;
    keyFeatures: string[];
    targetAudience: string;
    uniqueSellingPoints: string[];
}

// --- Helper Components ---
const SkeletonLoader = () => (
    <div className="space-y-4 p-4">
        <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2 mt-6 animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
    </div>
);

const AIAnalysisPill = ({ text }: { text: string }) => (
    <motion.div
        className="text-xs bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full border border-blue-500/50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
    >
        {text}
    </motion.div>
);

// --- Main Component ---
const CopyGenerator: React.FC<CopyGeneratorProps> = ({ onAddToHistory, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    contentType: 'facebook-ad',
    images: [],
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const contentTypes = [
    { value: 'facebook-ad', label: 'Facebook/Google Ad' },
    { value: 'instagram-caption', label: 'Instagram Caption' },
    { value: 'cold-email', label: 'Cold Outreach Email' },
    { value: 'landing-page', label: 'Landing Page Copy' },
  ];

  const handleImagesChange = async (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
    if (images.length > 0) {
      setIsAnalyzing(true);
      setAiAnalysis(null);
      try {
        const analysis = await analyzeProductImages(images);
        setAiAnalysis(analysis);
        setFormData(prev => ({
          ...prev,
          productDescription: analysis.enhancedDescription + (prev.productDescription ? `\n\n${prev.productDescription}` : ''),
        }));
        toast.success('AI analysis complete! Description enhanced.');
      } catch (error) {
        console.error('Image analysis failed:', error);
        toast.error('AI analysis failed. Please proceed manually.');
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setAiAnalysis(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.productDescription || formData.images.length === 0) {
      toast.error('Please fill all fields and upload an image.');
      return;
    }
    setIsLoading(true);
    setGeneratedContent('');
    try {
      let promptData = formData.productDescription;
      if (aiAnalysis) {
        promptData += `\n\n--- AI Visual Analysis Context ---\nKey Features: ${aiAnalysis.keyFeatures.join(', ')}\nTarget Audience: ${aiAnalysis.targetAudience}\nUnique Selling Points: ${aiAnalysis.uniqueSellingPoints.join(', ')}`;
      }
      const prompt = formatPrompt(formData.productName, promptData, formData.contentType);
      const content = await generateContent(prompt);
      setGeneratedContent(content);
      onAddToHistory({
        productName: formData.productName,
        contentType: formData.contentType,
        content: content,
        pageType: 'copy-generator',
      });
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if(!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleRegenerate = () => handleSubmit(new Event('submit') as any);
  
  const handleReset = () => {
      setFormData({ productName: '', productDescription: '', contentType: 'facebook-ad', images: [] });
      setGeneratedContent('');
      setAiAnalysis(null);
      toast.info("Form cleared.");
  }

  const renderPreview = () => {
    if (isLoading && !generatedContent) return <SkeletonLoader />;
    if (!generatedContent || formData.images.length === 0) {
      return (
        <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full p-4">
            <Eye className="w-12 h-12 mb-4" />
            <p className="font-semibold">Platform Preview</p>
            <p className="text-sm">Your preview will appear here.</p>
        </div>
      );
    }
    switch (formData.contentType) {
      case 'instagram-caption': return <InstagramPreview images={formData.images} caption={generatedContent} username={formData.productName.toLowerCase().replace(/\s+/g, '_')} />;
      case 'facebook-ad': return <FacebookPreview images={formData.images} content={generatedContent} pageName={formData.productName} />;
      case 'cold-email': return <GmailPreview content={generatedContent} productName={formData.productName} />;
      default: return <div className="p-4"><FormattedContent content={generatedContent} /></div>;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Copy Generator</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Visually analyze your products with AI to generate marketing copy that truly converts.
          </p>
        </motion.div>

        {/* --- Main Grid Layout (2 Columns on Desktop) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* --- Left Column: Configuration Form (Sticky) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3"><FileText/> Configure</h3>
                    <button onClick={handleReset} title="Start Over" className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <ImageUpload images={formData.images} onImagesChange={handleImagesChange} maxImages={4} isAnalyzing={isAnalyzing}/>
                    
                    {aiAnalysis && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Brain className="w-4 h-4 text-blue-400"/>AI Visual Analysis</h4>
                            <div className="flex flex-wrap gap-2">
                                <AIAnalysisPill text={aiAnalysis.targetAudience} />
                                {aiAnalysis.keyFeatures.map(f => <AIAnalysisPill key={f} text={f}/>)}
                            </div>
                        </motion.div>
                    )}

                    <div>
                        <label htmlFor="productName" className="block text-slate-300 mb-2 font-semibold">Product Name *</label>
                        <input type="text" id="productName" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="e.g., Quantum Sneakers" required/>
                    </div>
                    <div>
                        <label htmlFor="productDescription" className="block text-slate-300 mb-2 font-semibold">Product Description *</label>
                        <textarea id="productDescription" value={formData.productDescription} onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })} rows={6} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none" placeholder="Describe your product's features and benefits..." required/>
                    </div>
                    <div>
                        <label htmlFor="contentType" className="block text-slate-300 mb-2 font-semibold">Content Type</label>
                        <select id="contentType" value={formData.contentType} onChange={(e) => setFormData({ ...formData, contentType: e.target.value })} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                            {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </select>
                    </div>
                    <motion.button type="submit" disabled={isLoading || isAnalyzing} className="w-full bg-white text-black py-4 rounded-lg font-bold text-lg hover:bg-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]" whileHover={{ scale: (isLoading || isAnalyzing) ? 1 : 1.02 }} whileTap={{ scale: (isLoading || isAnalyzing) ? 1 : 0.98 }}>
                        {isLoading ? <><Loader2 className="w-6 h-6 mr-2 animate-spin"/>Generating...</> : isAnalyzing ? <><Brain className="w-6 h-6 mr-2 animate-pulse"/>Analyzing...</> : <><Sparkles className="w-6 h-6 mr-2"/>Generate AI Copy</>}
                    </motion.button>
                </form>
            </div>
          </motion.div>

          {/* --- Right Column: Outputs (Vertically stacked) --- */}
          <div className="lg:col-span-3 flex flex-col gap-8">
              {/* --- Top Part: AI-Generated Copy (Internally scrollable) --- */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm flex flex-col h-full"
              >
                <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Sparkles/>AI-Generated Copy</h3>
                    {generatedContent && !isLoading && (
                        <div className="flex items-center gap-2">
                            <button onClick={handleRegenerate} title="Regenerate" className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-5 h-5"/></button>
                            <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                {copied ? <Check className="w-5 h-5 text-green-400"/> : <Copy className="w-5 h-5"/>}
                            </button>
                        </div>
                    )}
                </div>
                {/* This div handles the scrolling content */}
                <div className="px-6 pb-6 min-h-0 flex-1 overflow-y-auto max-h-[50vh] lg:max-h-[60vh]">
                     <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-6 min-h-full">
                        {isLoading ? <SkeletonLoader /> : generatedContent ? <FormattedContent content={generatedContent} /> : (
                            <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[200px]">
                                <ImageIcon className="w-12 h-12 mb-4" />
                                <p className="font-semibold">Your copy will appear here</p>
                                <p className="text-sm">Fill out the form to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
              </motion.div>

              {/* --- Bottom Part: Platform Preview --- */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Eye/>Platform Preview</h3>
                    <div className="bg-slate-900/70 border-slate-700 rounded-lg flex items-center justify-center p-4">
                        {renderPreview()}
                    </div>
                </div>
              </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CopyGenerator;