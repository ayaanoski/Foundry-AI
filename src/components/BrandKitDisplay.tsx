import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Target, MessageCircle, Lightbulb, Megaphone, Eye} from 'lucide-react';

interface BrandKitDisplayProps {
  content: string;
}

const BrandKitDisplay: React.FC<BrandKitDisplayProps> = ({ content }) => {
  const processInlineFormatting = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let keyCounter = 0;

    // Handle bold text (**text** or __text__)
    const boldRegex = /(\*\*|__)((?:(?!\1).)+?)\1/g;
    let match;
    const matches = [];

    // Collect all matches first
    while ((match = boldRegex.exec(text)) !== null) {
      matches.push(match);
    }

    // Process matches
    matches.forEach((match) => {
      // Add text before the bold match
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        if (beforeText) {
          parts.push(
            <span key={`text-${keyCounter++}`}>
              {beforeText}
            </span>
          );
        }
      }
      
      // Add the bold text
      parts.push(
        <strong 
          key={`bold-${keyCounter++}`} 
          className="text-white font-bold"
        >
          {match[2]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    });

    // Add any remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        parts.push(
          <span key={`text-${keyCounter++}`}>
            {remainingText}
          </span>
        );
      }
    }

    // If no formatting found, return original text
    if (parts.length === 0) {
      return [<span key="original">{text}</span>];
    }

    return parts;
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return <div key={lineIndex} className="h-3" />;
      }

      // Handle section headers with emojis
      if (line.match(/^(🎨|🎯|🧾|🗣️|📢)/)) {
        const cleanTitle = line.replace(/^(🎨|🎯|🧾|🗣️|📢)\s*/, '').trim();
        const emoji = line.match(/^(🎨|🎯|🧾|🗣️|📢)/)?.[1];
        
        const getSectionIcon = () => {
          switch (emoji) {
            case '🎨': return <Palette className="w-5 h-5" />;
            case '🎯': return <Target className="w-5 h-5" />;
            case '🧾': return <MessageCircle className="w-5 h-5" />;
            case '🗣️': return <Lightbulb className="w-5 h-5" />;
            case '📢': return <Megaphone className="w-5 h-5" />;
            default: return <Eye className="w-5 h-5" />;
          }
        };

        const getSectionColor = () => {
          switch (emoji) {
            case '🎨': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
            case '🎯': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            case '🧾': return 'text-green-400 border-green-400/30 bg-green-400/10';
            case '🗣️': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            case '📢': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
            default: return 'text-white/60 border-white/20 bg-white/5';
          }
        };

        return (
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: lineIndex * 0.1 }}
            className={`flex items-center space-x-3 mb-6 mt-8 first:mt-0 p-4 rounded-xl border ${getSectionColor()}`}
          >
            {getSectionIcon()}
            <h3 className="text-xl font-bold text-white">
              {processInlineFormatting(cleanTitle)}
            </h3>
          </motion.div>
        );
      }

      // Handle numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s*(.*)/);
      if (numberedMatch) {
        const number = numberedMatch[1];
        const text = numberedMatch[2];
        
        return (
          <motion.div 
            key={lineIndex} 
            className="mb-4 flex items-start group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: lineIndex * 0.05 }}
          >
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-4 mt-0.5 text-sm font-bold text-white/80 group-hover:bg-white/20 transition-colors flex-shrink-0">
              {number}
            </div>
            <div className="text-white/90 leading-relaxed">
              {processInlineFormatting(text)}
            </div>
          </motion.div>
        );
      }

      // Handle bullet points
      const bulletMatch = line.match(/^[\-\*•]\s*(.*)/);
      if (bulletMatch) {
        return (
          <motion.div 
            key={lineIndex} 
            className="mb-3 flex items-start group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: lineIndex * 0.05 }}
          >
            <div className="w-2 h-2 bg-white/60 rounded-full mr-4 mt-3 group-hover:bg-white transition-colors flex-shrink-0"></div>
            <div className="text-white/90 leading-relaxed">
              {processInlineFormatting(bulletMatch[1])}
            </div>
          </motion.div>
        );
      }

      // Handle sub-headers (all caps, short lines)
      if (line.match(/^[A-Z\s\d\-_:]+$/) && line.length < 60 && line.length > 3) {
        return (
          <motion.h4 
            key={lineIndex} 
            className="text-white/80 font-semibold text-lg mb-3 mt-6 first:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lineIndex * 0.05 }}
          >
            {processInlineFormatting(line)}
          </motion.h4>
        );
      }

      // Regular paragraphs
      return (
        <motion.p 
          key={lineIndex} 
          className="text-white/85 mb-3 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lineIndex * 0.05 }}
        >
          {processInlineFormatting(line)}
        </motion.p>
      );
    });
  };

  // Extract color codes for special display
  const extractColorCodes = (text: string) => {
    const hexRegex = /#[0-9A-Fa-f]{6}/g;
    return text.match(hexRegex) || [];
  };

  const colors = extractColorCodes(content);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-1"
    >
      {formatText(content)}
      
      {/* Color Palette Section - Only show if colors are found */}
      {colors.length > 0 && (
        <motion.div 
          className="mt-8 p-6 bg-[#404040] rounded-lg border border-[#505050]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 mr-2 text-white/80" />
            <h4 className="text-white font-bold text-lg">Brand Colors</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map((color, index) => (
              <motion.div 
                key={index} 
                className="group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div
                  className="w-16 h-16 rounded-lg border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300 mb-2"
                  style={{ backgroundColor: color }}
                />
                <div className="text-center">
                  <span className="text-white/90 text-xs font-mono bg-black/40 px-2 py-1 rounded">
                    {color}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BrandKitDisplay;