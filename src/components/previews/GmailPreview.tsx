import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Archive, Trash2, MoreVertical, Reply, ReplyAll, Forward, Paperclip } from 'lucide-react';

interface GmailPreviewProps {
  content: string;
  productName: string;
  senderName?: string;
  senderEmail?: string;
  recipientEmail?: string;
}

const GmailPreview: React.FC<GmailPreviewProps> = ({ 
  content, 
  productName,
  senderName = "Your Name",
  senderEmail = "you@company.com",
  recipientEmail = "prospect@company.com"
}) => {
  const [starred, setStarred] = useState(false);

  const extractSubject = (text: string) => {
    // Try to extract subject line from content
    const subjectMatch = text.match(/Subject:\s*(.+)/i);
    if (subjectMatch) {
      return subjectMatch[1].trim();
    }
    
    // Fallback: create subject from product name
    return `Introducing ${productName} - Perfect Solution for Your Business`;
  };

  const extractEmailBody = (text: string) => {
    // Remove subject line if present
    let body = text.replace(/Subject:\s*.+\n?/i, '');
    
    // Remove markdown formatting
    body = body
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    
    return body;
  };

  const subject = extractSubject(content);
  const emailBody = extractEmailBody(content);

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden border border-gray-200">
      {/* Gmail Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Archive className="w-4 h-4 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <Trash2 className="w-4 h-4 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <motion.button
                onClick={() => setStarred(!starred)}
                className={`transition-colors ${starred ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-800'}`}
                whileTap={{ scale: 0.9 }}
              >
                <Star className={`w-4 h-4 ${starred ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Email Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-medium text-gray-900 mb-4">{subject}</h2>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{senderName}</span>
                <span className="text-gray-500 text-sm">&lt;{senderEmail}&gt;</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                to {recipientEmail}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            2:30 PM (2 hours ago)
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="px-6 py-6">
        <div className="prose prose-sm max-w-none">
          <div className="text-gray-900 leading-relaxed whitespace-pre-line">
            {emailBody}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <ReplyAll className="w-4 h-4" />
            <span>Reply all</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Forward className="w-4 h-4" />
            <span>Forward</span>
          </button>
        </div>
      </div>

      {/* Gmail Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Inbox</span>
            <span>•</span>
            <span>Important</span>
          </div>
          <div className="flex items-center space-x-2">
            <Paperclip className="w-3 h-3" />
            <span>No attachments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailPreview;