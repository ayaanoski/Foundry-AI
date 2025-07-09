import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Palette, Target, MessageSquare, Mail, Globe, ArrowRight, Brain, Rocket, Star } from 'lucide-react';

interface HeroProps {
  onCopyGeneratorClick: () => void;
  onBrandKitClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCopyGeneratorClick, onBrandKitClick }) => {
  const copyFeatures = [
    { icon: Target, title: 'Facebook/Google Ads', desc: 'High-converting headlines that drive clicks and sales' },
    { icon: MessageSquare, title: 'Instagram Captions', desc: 'Engaging social media content that builds community' },
    { icon: Mail, title: 'Cold Emails', desc: 'Personalized outreach that gets responses and meetings' },
    { icon: Globe, title: 'Landing Pages', desc: 'Persuasive copy that converts visitors into customers' }
  ];

  const brandFeatures = [
    { icon: Palette, title: 'Visual Identity', desc: 'Complete color palettes with psychology-backed hex codes' },
    { icon: Target, title: 'Audience Intelligence', desc: 'Deep customer personas and behavioral insights' },
    { icon: MessageSquare, title: 'Brand Voice', desc: 'Consistent messaging guidelines and tone frameworks' },
    { icon: Rocket, title: 'Growth Strategy', desc: 'Comprehensive marketing roadmap for scale' }
  ];

  const stats = [
    { number: '10K+', label: 'Copies Generated' },
    { number: '500+', label: 'Brands Created' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'AI Availability' }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20 pb-20">
      <div className="text-center max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
<div className="flex items-center justify-center gap-6 mb-6 mt-10">
  <motion.div
    className="relative"
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
 <img
  src="/logo.png"
  alt="Foundry.AI Logo"
  className="w-32 h-32 z-10 relative"
/>

    <div className="absolute inset-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
  </motion.div>

  <h1 className="text-6xl md:text-8xl font-bold text-white leading-none">
    FOUNDRY.AI
  </h1>
</div>

          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center space-x-2 mb-6"
          >
            <Brain className="w-6 h-6 text-white/60" />
            <p className="text-xl md:text-2xl text-white/80 font-light">
              AI-Powered Marketing & Brand Intelligence
            </p>
            <Star className="w-6 h-6 text-white/60" />
          </motion.div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-white/60 mb-4 max-w-2xl mx-auto"
        >
          Powered by Advanced Neural Networks & IO.net Infrastructure
        </motion.p>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Transform Your Marketing with AI Precision
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Foundry.AI combines cutting-edge artificial intelligence with proven marketing psychology 
              to generate high-converting copy and comprehensive brand identities. Whether you're launching 
              a startup or scaling an enterprise, our AI agents deliver professional-grade marketing assets 
              in seconds, not weeks.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Sparkles className="w-8 h-8 text-white mb-4" />
                <h3 className="text-white font-bold mb-2">Instant Generation</h3>
                <p className="text-white/60 text-sm">Get professional marketing copy and brand assets in under 30 seconds</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Brain className="w-8 h-8 text-white mb-4" />
                <h3 className="text-white font-bold mb-2">Psychology-Driven</h3>
                <p className="text-white/60 text-sm">Every output is optimized using proven conversion psychology principles</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Rocket className="w-8 h-8 text-white mb-4" />
                <h3 className="text-white font-bold mb-2">Scale Ready</h3>
                <p className="text-white/60 text-sm">From startup MVPs to enterprise campaigns, built to scale with you</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Feature Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Copy Generator Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-xl group-hover:from-white/10 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Sparkles className="w-12 h-12 text-white" />
                  <div className="absolute inset-0 w-12 h-12 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Copy Intelligence</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Generate high-converting marketing copy that drives action. Our AI analyzes millions 
                of successful campaigns to create compelling headlines, captions, emails, and landing pages 
                that resonate with your audience and maximize conversions.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {copyFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <feature.icon className="w-5 h-5 text-white/60 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                      <p className="text-white/50 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={onCopyGeneratorClick}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-300 group flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Sparkles className="mr-2 w-5 h-5" />
                Generate Copy
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Brand Kit Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl blur-xl group-hover:from-purple-500/20 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#2a1a2a] rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 h-full">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Palette className="w-12 h-12 text-white" />
                  <div className="absolute inset-0 w-12 h-12 bg-purple-500/30 rounded-full blur-lg animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Brand Intelligence</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Build a complete brand foundation from the ground up. Our AI creates comprehensive 
                brand identities including visual themes, color psychology, target audience analysis, 
                voice guidelines, and strategic marketing roadmaps tailored to your vision.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {brandFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <feature.icon className="w-5 h-5 text-purple-400/80 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                      <p className="text-white/50 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={onBrandKitClick}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-300 group flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Palette className="mr-2 w-5 h-5" />
                Create Brand Kit
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-white/40 text-sm space-y-2"
        >
          <div className="flex items-center justify-center space-x-6 flex-wrap">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>No signup required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Data stored locally</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Instant results</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Enterprise ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;