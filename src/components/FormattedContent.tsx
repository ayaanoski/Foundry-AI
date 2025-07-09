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

      // Process inline formatting
      let formattedLine = line;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      // Handle numbered lists
      const numberedListMatch = line.match(/^(\d+\.\s*)(.*)/);
      if (numberedListMatch) {
        return (
          <div key={lineIndex} className="mb-3 flex">
            <span className="text-white/60 font-bold mr-2 flex-shrink-0">
              {numberedListMatch[1]}
            </span>
            <span className="text-white/90">
              {processInlineFormatting(numberedListMatch[2])}
            </span>
          </div>
        );
      }

      // Handle bullet points
      const bulletMatch = line.match(/^([•\-\*]\s*)(.*)/);
      if (bulletMatch) {
        return (
          <div key={lineIndex} className="mb-2 flex">
            <span className="text-white/60 mr-2 flex-shrink-0">•</span>
            <span className="text-white/90">
              {processInlineFormatting(bulletMatch[2])}
            </span>
          </div>
        );
      }

      // Handle headers (lines that are all caps or start with #)
      if (line.match(/^[A-Z\s\d\-_:]+$/) && line.length < 50) {
        return (
          <h4 key={lineIndex} className="text-white font-bold text-lg mb-3 mt-6 first:mt-0">
            {line}
          </h4>
        );
      }

      // Handle lines starting with #
      const headerMatch = line.match(/^(#+)\s*(.*)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const headerText = headerMatch[2];
        const HeaderTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
        
        return (
          <HeaderTag key={lineIndex} className="text-white font-bold mb-3 mt-6 first:mt-0">
            {headerText}
          </HeaderTag>
        );
      }

      // Regular paragraph
      return (
        <p key={lineIndex} className="text-white/90 mb-3 leading-relaxed">
          {processInlineFormatting(line)}
        </p>
      );
    });
  };

  const processInlineFormatting = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Bold text (**text** or __text__)
    const boldRegex = /(\*\*|__)(.*?)\1/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add bold text
      parts.push(
        <strong key={match.index} className="text-white font-bold">
          {match[2]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // If no formatting was found, return the original text
    if (parts.length === 0) {
      parts.push(text);
    }

    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="prose prose-invert max-w-none"
    >
      {formatText(content)}
    </motion.div>
  );
};

export default FormattedContent;