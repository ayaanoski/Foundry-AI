import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  // The react-markdown library handles everything automatically.
  // We wrap it in a div with Tailwind's 'prose' classes for beautiful typography.
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // 'prose' applies beautiful styling to markdown.
      // 'prose-invert' optimizes it for dark backgrounds.
      // 'max-w-none' ensures it takes the full width of its container.
      className="prose prose-invert max-w-none text-white/90
                 prose-p:leading-relaxed 
                 prose-headings:text-white 
                 prose-strong:text-white
                 prose-bullets:bg-white/60
                 prose-a:text-purple-400 hover:prose-a:text-purple-300"
    >
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};

export default FormattedContent;