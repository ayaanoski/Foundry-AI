import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown'; // <-- IMPORT THIS
import { Palette,  MessageCircle, Lightbulb, Megaphone, Star, Users } from 'lucide-react';
import { BrandKitData } from '../utils/parseBrandKit';

// Helper function to render markdown content
const MarkdownContent = ({ content }: { content: string }) => (
    <div className="prose prose-sm prose-invert max-w-none text-slate-300">
        <ReactMarkdown components={{ p: 'span' }}>{content}</ReactMarkdown>
    </div>
);


const InfoCard = ({ title, icon, content, className }: { title: string, icon: React.ReactNode, content: string[], className?: string }) => {
    // Check if there is any actual content to display
    const hasContent = content && content.length > 0 && content.some(item => item.trim() !== '');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`bg-slate-900/70 border border-slate-700 rounded-2xl p-4 sm:p-6 flex flex-col ${className}`}
        >
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h4 className="font-bold text-white text-lg">{title}</h4>
            </div>
            <div className="space-y-2 text-sm">
                {hasContent ? (
                    content.map((item, i) => (
                        <div key={i} className="flex items-start">
                             <span className="text-slate-500 mr-2 mt-1">•</span>
                             {/* Use the new MarkdownContent component to render bold text etc. */}
                             <MarkdownContent content={item} />
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500">No data generated for this section.</p>
                )}
            </div>
        </motion.div>
    );
}

const ColorPaletteCard = ({ colors }: { colors: { name: string, hex: string }[] }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const hasContent = colors && colors.length > 0;

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 sm:p-6 md:col-span-2"
    >
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-6 h-6 text-purple-400" />
        <h4 className="font-bold text-white text-lg">Color Palette</h4>
      </div>
      {hasContent ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colors.map(({ name, hex }) => (
            <div key={name} className="flex flex-col items-center gap-2">
                <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full border-2 border-slate-600 cursor-pointer shadow-lg"
                style={{ backgroundColor: hex }}
                onClick={() => handleCopy(hex)}
                />
                <div className="text-center">
                <p className="text-sm font-semibold text-white">{name}</p>
                <AnimatePresence mode="wait">
                    <motion.p 
                    key={copiedHex === hex ? 'copied' : 'hex'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-slate-400 font-mono"
                    >
                    {copiedHex === hex ? 'Copied!' : hex}
                    </motion.p>
                </AnimatePresence>
                </div>
            </div>
            ))}
        </div>
      ) : (
        <p className="text-slate-500">No data generated for this section.</p>
      )}
    </motion.div>
  );
};

// Main Display Component
interface BrandKitDisplayProps {
  kit: BrandKitData;
}

const BrandKitDisplay: React.FC<BrandKitDisplayProps> = ({ kit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard title="Brand Theme & Mood" icon={<Star className="w-6 h-6 text-yellow-400"/>} content={kit.theme} className="md:col-span-2" />
      <InfoCard title="Target Audience" icon={<Users className="w-6 h-6 text-blue-400"/>} content={kit.audience} />
      <InfoCard title="Brand Voice & Tone" icon={<MessageCircle className="w-6 h-6 text-green-400"/>} content={kit.voice} />
      <ColorPaletteCard colors={kit.colors} />
      <InfoCard title="Tagline Suggestions" icon={<Lightbulb className="w-6-6 text-orange-400"/>} content={kit.taglines} />
      <InfoCard title="Marketing Strategies" icon={<Megaphone className="w-6 h-6 text-red-400"/>} content={kit.marketing} />
    </div>
  );
};

export default BrandKitDisplay;