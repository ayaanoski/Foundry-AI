import React from 'react';
import { motion } from 'framer-motion';
import { Zap, History, Home, ArrowLeft } from 'lucide-react';
import { PageType } from '../App';

interface HeaderProps {
  onHistoryClick: () => void;
  onHomeClick: () => void;
  currentPage: PageType;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick, onHomeClick, currentPage }) => {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'copy-generator':
        return 'Copy Generator';
      case 'brand-kit':
        return 'Brand Kit Generator';
      case 'history':
        return 'History';
      default:
        return '';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {currentPage !== 'home' && (
              <motion.button
                onClick={onHomeClick}
                className="flex items-center text-white/60 hover:text-white mr-4 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
            
<motion.div
  className="flex items-center cursor-pointer"
  onClick={onHomeClick}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <img
    src="/logo.png"
    alt="Foundry.AI Logo"
    className="w-12 h-12 mr-4" // Increased size from w-8 h-8 to w-12 h-12
  />
  <div>
    <h1 className="text-3xl font-bold text-white">FOUNDRY.AI</h1>
    {getPageTitle() && (
      <p className="text-sm text-white/60 -mt-1">{getPageTitle()}</p>
    )}
  </div>
</motion.div>
          </div>
          
          <motion.button
            onClick={onHistoryClick}
            className="flex items-center bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-lg transition-colors border border-[#2a2a2a]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentPage === 'history' ? (
              <>
                <Home className="w-5 h-5 mr-2" />
                Home
              </>
            ) : (
              <>
                <History className="w-5 h-5 mr-2" />
                History
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;