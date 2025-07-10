import React from 'react';
import { motion } from 'framer-motion';

interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  const formatText = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return <br key={lineIndex} />;
      }

      // Handle numbered lists
      const numberedListMatch = line.match(/^(\d+\.\s*)(.*)/);
      if (numberedListMatch) {
        return (
          <motion.div 
            key={lineIndex} 
            className="mb-4 flex items-start group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: lineIndex * 0.1 }}
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-4 mt-0.5 text-sm font-bold text-white/80 group-hover:bg-white/20 transition-colors flex-shrink-0">
              {numberedListMatch[1].replace('.', '').trim()}
            </div>
            <div className="text-white/90 leading-relaxed">
              {processInlineFormatting(numberedListMatch[2])}
            </div>
          </motion.div>
        );
      }

      // Handle bullet points
      const bulletMatch = line.match(/^([•\-\*]\s*)(.*)/);
      if (bulletMatch) {
        return (
          <motion.div 
            key={lineIndex} 
            className="mb-3 flex items-start group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: lineIndex * 0.1 }}
          >
            <div className="w-2 h-2 bg-white/60 rounded-full mr-4 mt-3 group-hover:bg-white transition-colors flex-shrink-0"></div>
            <div className="text-white/90 leading-relaxed">
              {processInlineFormatting(bulletMatch[2])}
            </div>
          </motion.div>
        );
      }

      // Handle headers (lines that are all caps or start with #)
      if (line.match(/^[A-Z\s\d\-_:]+$/) && line.length < 60 && line.length > 3) {
        return (
          <motion.h4 
            key={lineIndex} 
            className="text-white font-bold text-xl mb-4 mt-8 first:mt-0 border-b border-white/20 pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lineIndex * 0.1 }}
          >
            {line}
          </motion.h4>
        );
      }

      // Handle lines starting with #
      const headerMatch = line.match(/^(#+)\s*(.*)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const headerText = headerMatch[2];
        const HeaderTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
        const headerSizes = {
          h3: 'text-2xl',
          h4: 'text-xl',
          h5: 'text-lg',
          h6: 'text-base'
        };
        
        return (
          <motion.div key={lineIndex}>
            <HeaderTag 
              className={`text-white font-bold mb-4 mt-6 first:mt-0 ${headerSizes[HeaderTag as keyof typeof headerSizes] || 'text-lg'}`}
            >
              {processInlineFormatting(headerText)}
            </HeaderTag>
          </motion.div>
        );
      }

      // Regular paragraph
      return (
        <motion.p 
          key={lineIndex} 
          className="text-white/90 mb-4 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lineIndex * 0.1 }}
        >
          {processInlineFormatting(line)}
        </motion.p>
      );
    });
  };

  const processInlineFormatting = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let keyCounter = 0;

    // Find all bold patterns (**text** or __text__)
    const boldRegex = /(\*\*|__)((?:(?!\1).)+)\1/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold match
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        parts.push(
          <span key={`text-${keyCounter++}`}>
            {beforeText}
          </span>
        );
      }
      
      // Add the bold text with enhanced styling
      parts.push(
        <strong 
          key={`bold-${keyCounter++}`} 
          className="text-white font-bold bg-gradient-to-r from-white/20 to-white/10 px-2 py-0.5 rounded-md border border-white/20"
        >
          {match[2]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last match
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {remainingText}
        </span>
      );
    }

    // If no bold formatting was found, return the original text
    if (parts.length === 0) {
      return [<span key="original">{text}</span>];
    }

    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="prose prose-invert max-w-none space-y-2"
    >
      {formatText(content)}
    </motion.div>
  );
};

export default FormattedContent;