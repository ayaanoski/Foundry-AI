import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Copy, Clock, ArrowRight, Download, FileText, Palette as PaletteIcon } from 'lucide-react';
import { PageType } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface HistoryItem {
  id: string;
  productName: string;
  contentType: string;
  content: string;
  timestamp: number;
  pageType: 'copy-generator' | 'brand-kit';
}

interface HistoryProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
  onNavigate: (page: PageType) => void;
}

const History: React.FC<HistoryProps> = ({ history, onDelete, onCopy, onNavigate }) => {
  const contentTypeLabels: { [key: string]: string } = {
    'facebook-ad': 'Facebook/Google Ad',
    'instagram-caption': 'Instagram Caption',
    'cold-email': 'Cold Email',
    'landing-page': 'Landing Page',
    'brand-kit': 'Brand Kit'
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPageTypeColor = (pageType: string) => {
    return pageType === 'brand-kit' ? 'text-purple-400' : 'text-blue-400';
  };

  const getPageTypeIcon = (pageType: string) => {
    return pageType === 'brand-kit' ? <PaletteIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  const downloadAsPDF = async (item: HistoryItem) => {
    try {
      // Create a temporary div with the content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = '#1a1a1a';
      tempDiv.style.color = '#ffffff';
      tempDiv.style.fontFamily = 'Rubik Mono One, monospace';
      tempDiv.style.lineHeight = '1.6';
      
      // Add header
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2a2a2a; padding-bottom: 20px;">
          <h1 style="font-size: 32px; margin: 0; color: #ffffff;">FOUNDRY.AI</h1>
          <p style="font-size: 16px; color: #888; margin: 10px 0 0 0;">${contentTypeLabels[item.contentType]}</p>
          <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">${item.productName}</p>
          <p style="font-size: 12px; color: #555; margin: 5px 0 0 0;">${formatDate(item.timestamp)}</p>
        </div>
      `;
      
      // Add content
      const content = document.createElement('div');
      content.style.whiteSpace = 'pre-wrap';
      content.style.fontSize = '14px';
      content.style.lineHeight = '1.8';
      content.textContent = item.content;
      
      tempDiv.appendChild(header);
      tempDiv.appendChild(content);
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#1a1a1a',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Remove temp div
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download
      const fileName = `foundry-ai-${item.contentType}-${item.productName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: create simple text PDF
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(item.content, 180);
      pdf.text(lines, 10, 10);
      pdf.save(`foundry-ai-${item.contentType}.pdf`);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8">
            <Clock className="w-20 h-20 text-white/20 mx-auto" />
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-white/5 rounded-full blur-xl"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No History Yet</h3>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
            Your generated content will appear here. Start creating with our AI-powered tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <motion.button
              onClick={() => onNavigate('copy-generator')}
              className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="mr-2 w-5 h-5" />
              Generate Copy
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => onNavigate('brand-kit')}
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-500 hover:to-purple-400 transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PaletteIcon className="mr-2 w-5 h-5" />
              Create Brand Kit
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">Generation History</h3>
          <p className="text-white/60">
            {history.length} item{history.length !== 1 ? 's' : ''} • All data stored locally
          </p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl blur-xl group-hover:from-white/10 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getPageTypeIcon(item.pageType)}
                    <h4 className="text-xl font-bold text-white">{item.productName}</h4>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`px-3 py-1 rounded-full bg-white/10 ${getPageTypeColor(item.pageType)} font-medium`}>
                      {contentTypeLabels[item.contentType]}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{formatDate(item.timestamp)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => downloadAsPDF(item)}
                    className="bg-[#2a2a2a] hover:bg-green-600 text-white p-3 rounded-xl transition-all duration-300 group/btn"
                    title="Download as PDF"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                  </motion.button>
                  <motion.button
                    onClick={() => onCopy(item.content)}
                    className="bg-[#2a2a2a] hover:bg-blue-600 text-white p-3 rounded-xl transition-all duration-300 group/btn"
                    title="Copy to clipboard"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4 group-hover/btn:animate-pulse" />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(item.id)}
                    className="bg-[#2a2a2a] hover:bg-red-600 text-white p-3 rounded-xl transition-all duration-300 group/btn"
                    title="Delete item"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4 group-hover/btn:animate-pulse" />
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#404040] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <p className="text-white/85 text-sm leading-relaxed line-clamp-4">
                    {item.content.length > 300 ? `${item.content.substring(0, 300)}...` : item.content}
                  </p>
                  {item.content.length > 300 && (
                    <div className="mt-4">
                      <span className="text-white/40 text-xs">
                        +{item.content.length - 300} more characters
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;