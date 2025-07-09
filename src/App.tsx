import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DynamicBackground from './components/DynamicBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import CopyGenerator from './components/CopyGenerator';
import BrandKitGenerator from './components/BrandKitGenerator';
import History from './components/History';

export type PageType = 'home' | 'copy-generator' | 'brand-kit' | 'history';

interface HistoryItem {
  id: string;
  productName: string;
  contentType: string;
  content: string;
  timestamp: number;
  pageType: 'copy-generator' | 'brand-kit';
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('copyforge-history');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const historyItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    const newHistory = [historyItem, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('copyforge-history', JSON.stringify(newHistory));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('copyforge-history', JSON.stringify(newHistory));
    toast.success('Item deleted from history');
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'copy-generator':
        return (
          <CopyGenerator 
            onAddToHistory={addToHistory}
            onBack={() => navigateTo('home')}
          />
        );
      case 'brand-kit':
        return (
          <BrandKitGenerator 
            onAddToHistory={addToHistory}
            onBack={() => navigateTo('home')}
          />
        );
      case 'history':
        return (
          <div className="pt-24 container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <History
                history={history}
                onDelete={handleDeleteHistory}
                onCopy={handleCopy}
                onNavigate={navigateTo}
              />
            </div>
          </div>
        );
      default:
        return (
          <Hero 
            onCopyGeneratorClick={() => navigateTo('copy-generator')}
            onBrandKitClick={() => navigateTo('brand-kit')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <DynamicBackground />
      
      <Header 
        onHistoryClick={() => navigateTo('history')}
        onHomeClick={() => navigateTo('home')}
        currentPage={currentPage}
      />
      
      {renderCurrentPage()}
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;