import React from 'react';
import { motion } from 'framer-motion';
import { History, Home, ArrowLeft } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo & Back Button */}
          <div className="flex items-center gap-4">
            {currentPage !== 'home' && (
              <motion.button
                onClick={onHomeClick}
                className="text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            )}

            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={onHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/logo.png"
                alt="Foundry.AI Logo"
                className="w-9 h-9 sm:w-12 sm:h-12"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-none">FOUNDRY.AI</h1>
                {getPageTitle() && (
                  <p className="text-xs sm:text-sm text-white/60 -mt-0.5 sm:-mt-1">{getPageTitle()}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* History Button */}
          <motion.button
            onClick={onHistoryClick}
            className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-sm sm:text-base px-4 py-2 rounded-lg border border-[#2a2a2a] transition-colors w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentPage === 'history' ? (
              <>
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Home
              </>
            ) : (
              <>
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
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
