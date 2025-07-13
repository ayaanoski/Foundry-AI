import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface FacebookPreviewProps {
  images: string[];
  content: string;
  pageName?: string;
}

const FacebookPreview: React.FC<FacebookPreviewProps> = ({ 
  images, 
  content, 
  pageName = "Your Brand" 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatContent = (text: string) => {
    // Remove markdown formatting and clean up
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\n\n+/g, '\n\n')
      .trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-lg mx-auto overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {pageName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{pageName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              2h • 🌍
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">
          {formatContent(content)}
        </p>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="relative">
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Product ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-2.5 h-2.5 text-white" />
            </div>
            <span>{Math.floor(Math.random() * 500) + 50}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{Math.floor(Math.random() * 50) + 5} comments</span>
            <span>{Math.floor(Math.random() * 20) + 2} shares</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-2 border-b border-gray-200">
        <motion.button
          onClick={() => setLiked(!liked)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            liked ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span className="font-medium">Like</span>
        </motion.button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <Share className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <span className="text-gray-500 text-sm">Write a comment...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookPreview;