import React from 'react';
import { motion } from 'framer-motion';

interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  const cleanAndFormatText = (text: string) => {
    // Clean the text first
    let cleanText = text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove extra whitespace and normalize line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      // Remove any remaining markdown artifacts
      .replace(/^#+\s*/gm, '')
      .replace(/^[\-\*\+]\s*/gm, '• ')
      .replace(/^\d+\.\s*/gm, (match, offset, string) => {
        const lineStart = string.lastIndexOf('\n', offset) + 1;
        const lineNumber = string.substring(0, offset).split('\n').length;
        return `${lineNumber - (string.substring(0, lineStart).split('\n').length - 1)}. `;
      });

    // Split into paragraphs and format
    const paragraphs = cleanText.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      if (!trimmedParagraph) return null;

      // Handle numbered lists
      if (trimmedParagraph.match(/^\d+\./)) {
        const lines = trimmedParagraph.split('\n');
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
          >
            {lines.map((line, lineIndex) => {
              const numberedMatch = line.match(/^(\d+)\.\s*(.*)/);
              if (numberedMatch) {
                return (
                  <div key={lineIndex} className="flex items-start mb-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white/80 flex-shrink-0">
                      {numberedMatch[1]}
                    </div>
                    <div className="text-white/90 leading-relaxed">{numberedMatch[2]}</div>
                  </div>
                );
              }
              return (
                <div key={lineIndex} className="text-white/90 leading-relaxed mb-2">
                  {line}
                </div>
              );
            })}
          </motion.div>
        );
      }

      // Handle bullet points
      if (trimmedParagraph.includes('•')) {
        const lines = trimmedParagraph.split('\n');
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
          >
            {lines.map((line, lineIndex) => {
              if (line.trim().startsWith('•')) {
                return (
                  <div key={lineIndex} className="flex items-start mb-2">
                    <div className="w-2 h-2 bg-white/60 rounded-full mr-3 mt-3 flex-shrink-0"></div>
                    <div className="text-white/90 leading-relaxed">{line.replace('•', '').trim()}</div>
                  </div>
                );
              }
              return (
                <div key={lineIndex} className="text-white/90 leading-relaxed mb-2">
                  {line}
                </div>
              );
            })}
          </motion.div>
        );
      }

      // Regular paragraph
      return (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-white/90 mb-4 leading-relaxed"
        >
          {trimmedParagraph}
        </motion.p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="space-y-2">
      {cleanAndFormatText(content)}
    </div>
  );
};

export default FormattedContent;