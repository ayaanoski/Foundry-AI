import React from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { Trash2, Copy, Clock, ArrowRight, Download, FileText, Palette as PaletteIcon } from 'lucide-react';
import { PageType } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- INTERFACES AND TYPES ---
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

// --- NEW: DEDICATED COMPONENT FOR PDF STYLING ---
const PdfDocument: React.FC<{ item: HistoryItem }> = ({ item }) => {
  const contentTypeLabels: { [key: string]: string } = { 'facebook-ad': 'Facebook/Google Ad', 'instagram-caption': 'Instagram Caption', 'cold-email': 'Cold Email', 'landing-page': 'Landing Page', 'brand-kit': 'Brand Kit' };
  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const renderContent = (content: ContentType, isTopLevel = true): React.ReactNode => {
    if (typeof content === 'string') {
      return <p style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1', margin: 0 }}>{content}</p>;
    }
    if (typeof content === 'object' && content !== null) {
      return (
        <div style={{ display: 'grid', gap: isTopLevel ? '20px' : '12px' }}>
          {Object.entries(content).map(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} style={isTopLevel ? { border: '1px solid #374151', borderRadius: '12px', padding: '20px', backgroundColor: '#1f2937' } : {}}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#f9fafb', margin: '0 0 12px 0', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>
                  {formattedKey}
                </h4>
                <div style={{ paddingLeft: isTopLevel ? '0' : '12px' }}>
                  {renderContent(value, false)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div id="pdf-content-to-capture" style={{
        position: 'absolute',
        left: '-9999px',
        width: '210mm',
        backgroundColor: '#111827',
        color: '#f9fafb',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.6',
    }}>
      <div style={{ padding: '20mm' }}>
        <div style={{ textAlign: 'center', marginBottom: '20mm', borderBottom: '1px solid #4b5563', paddingBottom: '10mm' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '0' }}>FOUNDRY.AI</h1>
            <p style={{ fontSize: '16px', color: '#d1d5db', margin: '8px 0 0 0' }}>Content Generation Report</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20mm', fontSize: '12px' }}>
            <div>
                <p style={{ margin: 0, color: '#9ca3af' }}><strong>Product/Brand:</strong></p>
                <p style={{ margin: '4px 0 0 0', color: '#f9fafb' }}>{item.productName}</p>
            </div>
            <div>
                <p style={{ margin: 0, color: '#9ca3af' }}><strong>Content Type:</strong></p>
                <p style={{ margin: '4px 0 0 0', color: '#f9fafb' }}>{contentTypeLabels[item.contentType]}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: '#9ca3af' }}><strong>Date Generated:</strong></p>
                <p style={{ margin: '4px 0 0 0', color: '#f9fafb' }}>{formatDate(item.timestamp)}</p>
            </div>
        </div>
        <div>{renderContent(item.content)}</div>
      </div>
    </div>
  );
};


// --- RECURSIVE DISPLAY FOR ON-SCREEN VIEW ---
const RecursiveContentDisplay: React.FC<{ content: ContentType }> = ({ content }) => {
    if (typeof content === 'string') { return (<p className="text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{content}</p>); }
    if (typeof content === 'object' && content !== null) { return (<div className="space-y-4">{Object.entries(content).map(([key, value]) => (<div key={key}><h5 className="text-xs sm:text-sm font-bold text-white/50 uppercase tracking-wider mb-2">{key.replace(/([A-Z])/g, ' $1')}</h5><div className="pl-3 border-l-2 border-white/10">{typeof value === 'string' ? (<p className="text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{value}</p>) : (<RecursiveContentDisplay content={value} />)}</div></div>))}</div>); }
    return null;
};
// --- RECURSIVE FORMATTER FOR COPYING ---
const formatContentToString = (content: ContentType, indentLevel = 0): string => {
    const indent = '  '.repeat(indentLevel); if (typeof content === 'string') return content; if (typeof content === 'object' && content !== null) { return Object.entries(content).map(([key, value]) => { const formattedKey = key.replace(/([A-Z])/g, ' $1').toUpperCase(); if (typeof value === 'object' && value !== null) { return `${indent}${formattedKey}:\n${formatContentToString(value, indentLevel + 1)}`; } return `${indent}${formattedKey}:\n${indent}  ${value}`; }).join('\n\n'); } return '';
};


const History: React.FC<HistoryProps> = ({ history, onDelete, onCopy, onNavigate }) => {
    const contentTypeLabels: { [key: string]: string } = { 'facebook-ad': 'Facebook/Google Ad', 'instagram-caption': 'Instagram Caption', 'cold-email': 'Cold Email', 'landing-page': 'Landing Page', 'brand-kit': 'Brand Kit' };
    const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const getPageTypeColor = (pageType: string) => pageType === 'brand-kit' ? 'text-purple-300' : 'text-blue-300';
    const getPageTypeIcon = (pageType: string) => pageType === 'brand-kit' ? <PaletteIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />;

    // --- REBUILT AND FINALIZED PDF GENERATOR ---
    const downloadAsPDF = async (item: HistoryItem) => {
        const tempContainer = document.createElement('div');
        document.body.appendChild(tempContainer);
        const root = ReactDOM.createRoot(tempContainer);
        
        root.render(<PdfDocument item={item} />);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const pdfContentElement = document.getElementById('pdf-content-to-capture');
            if (!pdfContentElement) throw new Error("PDF content element not found.");

            const canvas = await html2canvas(pdfContentElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: null, // Use transparent background for canvas
                windowWidth: pdfContentElement.scrollWidth,
                windowHeight: pdfContentElement.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // **FIX: Fill first page background and add image**
            pdf.setFillColor('#111827');
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            // **FIX: Add new pages with background fill if content overflows**
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.setFillColor('#111827');
                pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            // **FIX: Add watermark to the LAST page**
            pdf.setFontSize(10);
            pdf.setTextColor('#4B5563'); // Darker gray for subtlety
            pdf.text('Generated by FOUNDRY.AI', pdfWidth / 2, pdfHeight - 10, { align: 'center' });

            pdf.save(`foundry-ai-${item.productName.replace(/\s+/g, '-')}.pdf`);
        
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            root.unmount();
            document.body.removeChild(tempContainer);
        }
    };
    
    // "No History" state
    if (history.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="relative inline-block mb-8"><Clock className="w-20 h-20 text-white/10 mx-auto" /><div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div></div>
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
    
    // Main history list rendering
    return (
        <div className="space-y-6 sm:space-y-8">
            <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div><h3 className="text-2xl sm:text-3xl font-bold text-white">Generation History</h3><p className="text-white/50 text-sm sm:text-base mt-1">{history.length} item{history.length !== 1 ? 's' : ''} saved locally</p></div>
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
                                        <span className={`font-medium ${getPageTypeColor(item.pageType)}`}>{contentTypeLabels[item.contentType]}</span><span className="text-white/30">•</span><span className="text-white/50">{formatDate(item.timestamp)}</span>
                                    </div>
                                </div>
                                <div className="flex items-start sm:items-center gap-2">
                                    <motion.button onClick={() => downloadAsPDF(item)} className="p-2 rounded-md bg-white/10 hover:bg-green-500 text-white/70 hover:text-white transition-all" title="Download as PDF" whileTap={{ scale: 0.9 }}><Download className="w-4 h-4 sm:w-5 sm:h-5" /></motion.button>
                                    <motion.button onClick={() => onCopy(formatContentToString(item.content))} className="p-2 rounded-md bg-white/10 hover:bg-blue-500 text-white/70 hover:text-white transition-all" title="Copy Content" whileTap={{ scale: 0.9 }}><Copy className="w-4 h-4 sm:w-5 sm:h-5" /></motion.button>
                                    <motion.button onClick={() => onDelete(item.id)} className="p-2 rounded-md bg-white/10 hover:bg-red-500 text-white/70 hover:text-white transition-all" title="Delete" whileTap={{ scale: 0.9 }}><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></motion.button>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-4 sm:p-5 mt-2"><RecursiveContentDisplay content={item.content} /></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default History;