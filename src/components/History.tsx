import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Copy, Clock, ArrowRight, Download, FileText, Palette as PaletteIcon } from 'lucide-react';
import { PageType } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// More flexible ContentType to allow for nested objects
type ContentType = string | { [key: string]: any };

interface HistoryItem {
  id: string;
  productName: string;
  contentType: string;
  content: ContentType;
  timestamp: number;
  pageType: 'copy-generator' | 'brand-kit';
}

interface HistoryProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
  onNavigate: (page: PageType) => void;
}

// RECURSIVE HELPER: Formats any content to a clean string for copy/paste and PDF
const formatContentToString = (content: ContentType, indentLevel = 0): string => {
  const indent = '  '.repeat(indentLevel);
  if (typeof content === 'string') return content;

  if (typeof content === 'object' && content !== null) {
    return Object.entries(content)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').toUpperCase();
        if (typeof value === 'object' && value !== null) {
          return `${indent}${formattedKey}:\n${formatContentToString(value, indentLevel + 1)}`;
        }
        return `${indent}${formattedKey}:\n${indent}  ${value}`;
      })
      .join('\n\n');
  }
  return '';
};

// RECURSIVE COMPONENT: Renders any level of nested content with a clean UI
const RecursiveContentDisplay: React.FC<{ content: ContentType }> = ({ content }) => {
  if (typeof content === 'string') {
    return (
      <p className="text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    );
  }

  if (typeof content === 'object' && content !== null) {
    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <h5 className="text-xs sm:text-sm font-bold text-white/50 uppercase tracking-wider mb-2">
              {key.replace(/([A-Z])/g, ' $1')}
            </h5>
            <div className="pl-3 border-l-2 border-white/10">
              {typeof value === 'string' ? (
                <p className="text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{value}</p>
              ) : (
                <RecursiveContentDisplay content={value} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


const History: React.FC<HistoryProps> = ({ history, onDelete, onCopy, onNavigate }) => {
    const contentTypeLabels: { [key: string]: string } = { 'facebook-ad': 'Facebook/Google Ad', 'instagram-caption': 'Instagram Caption', 'cold-email': 'Cold Email', 'landing-page': 'Landing Page', 'brand-kit': 'Brand Kit' };
    const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const getPageTypeColor = (pageType: string) => pageType === 'brand-kit' ? 'text-purple-300' : 'text-blue-300';
    const getPageTypeIcon = (pageType: string) => pageType === 'brand-kit' ? <PaletteIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />;

    const downloadAsPDF = async (item: HistoryItem) => {
        const contentString = formatContentToString(item.content);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
            <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; background-color: #111827; color: #F9FAFB; }
                .pdf-container { padding: 40px; width: 800px; background-color: #111827; }
                .pdf-header { text-align: center; margin-bottom: 40px; border-bottom: 1px solid #374151; padding-bottom: 20px; }
                .pdf-logo { font-size: 28px; font-weight: bold; margin: 0; color: #F9FAFB; }
                .pdf-content-type { font-size: 16px; color: #9CA3AF; margin: 8px 0 0 0; }
                .pdf-product-name { font-size: 14px; color: #6B7280; margin: 4px 0 0 0; }
                .pdf-timestamp { font-size: 12px; color: #4B5563; margin: 4px 0 0 0; }
                .pdf-content { white-space: pre-wrap; font-size: 14px; line-height: 1.8; color: #D1D5DB; }
            </style>
            <div class="pdf-container">
                <div class="pdf-header">
                    <h1 class="pdf-logo">FOUNDRY.AI</h1>
                    <p class="pdf-content-type">${contentTypeLabels[item.contentType]}</p>
                    <p class="pdf-product-name">${item.productName}</p>
                    <p class="pdf-timestamp">${formatDate(item.timestamp)}</p>
                </div>
                <pre class="pdf-content">${contentString}</pre>
            </div>
        `;
        document.body.appendChild(tempDiv);

        try {
            const canvas = await html2canvas(tempDiv.querySelector('.pdf-container')!, { scale: 2, backgroundColor: '#111827' });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`foundry-ai-${item.productName.replace(/[^a-z0-9]/gi, '-')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            document.body.removeChild(tempDiv);
        }
    };
    
    // "No History" state with responsive design
    if (history.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="relative inline-block mb-8">
                        <Clock className="w-20 h-20 text-white/10 mx-auto" />
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">No History Yet</h3>
                    <p className="text-white/60 text-base sm:text-lg mb-8 max-w-md mx-auto">Your generated content will appear here. Start creating with our AI tools.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <motion.button onClick={() => onNavigate('copy-generator')} className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-all flex items-center justify-center group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FileText className="mr-2 w-5 h-5" />Generate Copy<ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></motion.button>
                        <motion.button onClick={() => onNavigate('brand-kit')} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-500 transition-all flex items-center justify-center group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><PaletteIcon className="mr-2 w-5 h-5" />Create Brand Kit<ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 sm:space-y-8">
            <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Generation History</h3>
                    <p className="text-white/50 text-sm sm:text-base mt-1">{history.length} item{history.length !== 1 ? 's' : ''} saved locally</p>
                </div>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {history.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`p-1.5 rounded-md bg-white/5 ${getPageTypeColor(item.pageType)}`}>{getPageTypeIcon(item.pageType)}</span>
                                        <h4 className="text-lg sm:text-xl font-bold text-white">{item.productName}</h4>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm">
                                        <span className={`font-medium ${getPageTypeColor(item.pageType)}`}>{contentTypeLabels[item.contentType]}</span>
                                        <span className="text-white/30">•</span>
                                        <span className="text-white/50">{formatDate(item.timestamp)}</span>
                                    </div>
                                </div>
                                <div className="flex items-start sm:items-center gap-2">
                                    <motion.button onClick={() => downloadAsPDF(item)} className="p-2 rounded-md bg-white/10 hover:bg-green-500 text-white/70 hover:text-white transition-all" title="Download as PDF" whileTap={{ scale: 0.9 }}><Download className="w-4 h-4 sm:w-5 sm:h-5" /></motion.button>
                                    <motion.button onClick={() => onCopy(formatContentToString(item.content))} className="p-2 rounded-md bg-white/10 hover:bg-blue-500 text-white/70 hover:text-white transition-all" title="Copy Content" whileTap={{ scale: 0.9 }}><Copy className="w-4 h-4 sm:w-5 sm:h-5" /></motion.button>
                                    <motion.button onClick={() => onDelete(item.id)} className="p-2 rounded-md bg-white/10 hover:bg-red-500 text-white/70 hover:text-white transition-all" title="Delete" whileTap={{ scale: 0.9 }}><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></motion.button>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-4 sm:p-5 mt-2">
                                <RecursiveContentDisplay content={item.content} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default History;