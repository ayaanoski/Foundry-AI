import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface InstagramPreviewProps {
  images: string[];
  caption: string;
  username?: string;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ 
  images, 
  caption, 
  username = "your_brand" 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

const formatCaption = (text: string) => {
  const cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\n\n+/g, '\n')
    .trim();

  const lines = cleaned.split(/\n|\. /).filter(Boolean); // split by newline or sentence
  return lines.length > 0 ? lines[0] : ''; // show only the first
};


  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">{username}</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </div>

      {/* Image Carousel */}
      <div className="relative aspect-square bg-gray-100">
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setLiked(!liked)}
              className={`transition-colors ${liked ? 'text-red-500' : 'text-gray-700'}`}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            <button className="text-gray-700">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-700">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <motion.button
            onClick={() => setSaved(!saved)}
            className={`transition-colors ${saved ? 'text-gray-900' : 'text-gray-700'}`}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-gray-900 text-sm">
            {Math.floor(Math.random() * 1000) + 100} likes
          </span>
        </div>

        {/* Caption */}
        <div className="text-sm text-gray-900">
          <span className="font-semibold mr-2">{username}</span>
          <span className="whitespace-pre-line">{formatCaption(caption)}</span>
        </div>

        {/* Comments */}
        <div className="mt-2 text-sm text-gray-500">
          View all {Math.floor(Math.random() * 50) + 10} comments
        </div>

        {/* Time */}
        <div className="mt-1 text-xs text-gray-400 uppercase">
          2 hours ago
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;