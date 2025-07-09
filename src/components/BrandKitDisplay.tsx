import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Users, MessageCircle, Zap, Globe, Store, Target, Lightbulb } from 'lucide-react';

interface BrandKitDisplayProps {
  content: string;
}

const BrandKitDisplay: React.FC<BrandKitDisplayProps> = ({ content }) => {
  const sections = content.split(/(?=🎨|🎯|🧾|🗣️|📢)/);
  
  const getSectionIcon = (section: string) => {
    if (section.includes('🎨') && section.toLowerCase().includes('theme')) return <Palette className="w-5 h-5" />;
    if (section.includes('🎨') && section.toLowerCase().includes('color')) return <Palette className="w-5 h-5" />;
    if (section.includes('🎯')) return <Target className="w-5 h-5" />;
    if (section.includes('🧾')) return <MessageCircle className="w-5 h-5" />;
    if (section.includes('🗣️')) return <Lightbulb className="w-5 h-5" />;
    if (section.includes('📢')) return <Globe className="w-5 h-5" />;
    return <Store className="w-5 h-5" />;
  };

  const getSectionColor = (section: string) => {
    if (section.includes('🎨') && section.toLowerCase().includes('theme')) return 'border-purple-500/30 bg-purple-500/5';
    if (section.includes('🎨') && section.toLowerCase().includes('color')) return 'border-pink-500/30 bg-pink-500/5';
    if (section.includes('🎯')) return 'border-blue-500/30 bg-blue-500/5';
    if (section.includes('🧾')) return 'border-green-500/30 bg-green-500/5';
    if (section.includes('🗣️')) return 'border-yellow-500/30 bg-yellow-500/5';
    if (section.includes('📢')) return 'border-orange-500/30 bg-orange-500/5';
    return 'border-white/10 bg-white/5';
  };

  const extractColorCodes = (text: string) => {
    const hexRegex = /#[0-9A-Fa-f]{6}/g;
    return text.match(hexRegex) || [];
  };

  const extractFonts = (text: string) => {
    const fontRegex = /font[:\-\s]*([\w\s,]+)/gi;
    const matches = text.match(fontRegex);
    if (!matches) return [];
    
    return matches.map(match => 
      match.replace(/font[:\-\s]*/i, '').trim()
    ).filter(font => font.length > 0);
  };

  const formatSectionContent = (content: string) => {
    const lines = content.split('\n').slice(1); // Remove first line (title)
    
    return lines.map((line, index) => {
      if (!line.trim()) return <br key={index} />;
      
      // Handle bullet points
      if (line.match(/^[\-\*•]\s/)) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="text-white/60 mr-2 mt-1">•</span>
            <span className="text-white/80">{line.replace(/^[\-\*•]\s/, '')}</span>
          </div>
        );
      }
      
      // Handle bold text
      const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      
      return (
        <p key={index} className="text-white/80 mb-2" dangerouslySetInnerHTML={{ __html: boldText }} />
      );
    });
  };

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (!section.trim()) return null;
        
        const colors = extractColorCodes(section);
        const fonts = extractFonts(section);
        const sectionTitle = section.split('\n')[0].replace(/🎨|🎯|🧾|🗣️|📢/g, '').trim();
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-xl p-6 border ${getSectionColor(section)}`}
          >
            <div className="flex items-center mb-4">
              {getSectionIcon(section)}
              <h4 className="text-lg font-bold text-white ml-2">
                {sectionTitle}
              </h4>
            </div>
            
            <div className="space-y-2">
              {formatSectionContent(section)}
            </div>
            
            {/* Color Palette Display */}
            {colors.length > 0 && (
              <div className="mt-6 p-4 bg-black/20 rounded-lg">
                <h5 className="text-white font-semibold mb-3">Color Palette</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="flex flex-col items-center space-y-2">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-white/20 shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-white/80 text-sm font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Font Display */}
            {fonts.length > 0 && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg">
                <h5 className="text-white font-semibold mb-3">Suggested Fonts</h5>
                <div className="space-y-2">
                  {fonts.map((font, fontIndex) => (
                    <div key={fontIndex} className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-white/20 rounded-full" />
                      <span className="text-white/80">{font}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BrandKitDisplay;