import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Target,
  MessageSquare,
  Mail,
  Globe,
  ArrowRight,
  Brain,
  Rocket,
  Star,
} from 'lucide-react';

interface HeroProps {
  onCopyGeneratorClick: () => void;
  onBrandKitClick: () => void;
}

// A beautiful and performant falling stars background
const StarsBackground = () => {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }).map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 5 + 5, // Slower, more gentle fall
      }));
      setStars(newStars);
    };
    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/80"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: '-10px',
          }}
          animate={{
            y: '100vh',
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ onCopyGeneratorClick, onBrandKitClick }) => {
  const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  };

  const copyFeatures = [
    { icon: Target, title: 'Ads That Convert', desc: 'Generate high-converting headlines for Facebook, Google, and more.' },
    { icon: MessageSquare, title: 'Engaging Social Posts', desc: 'Create captivating Instagram captions that build your community.' },
    { icon: Mail, title: 'Effective Cold Emails', desc: 'Craft personalized outreach emails that guarantee responses.' },
    { icon: Globe, title: 'Persuasive Landing Pages', desc: 'Develop compelling copy that turns visitors into loyal customers.' },
  ];

  const brandFeatures = [
    { icon: Palette, title: 'Visual Identity', desc: 'Generate complete color palettes with psychology-backed hex codes.' },
    { icon: Target, title: 'Audience Intelligence', desc: 'Build deep customer personas with actionable behavioral insights.' },
    { icon: MessageSquare, title: 'Brand Voice & Tone', desc: 'Define consistent messaging guidelines and powerful tone frameworks.' },
    { icon: Rocket, title: 'Strategic Growth Plan', desc: 'Receive a comprehensive marketing roadmap designed for scalability.' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <StarsBackground />
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-20 sm:space-y-32">

        <header className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <img src="/logo.png" alt="Foundry.AI Logo" className="w-40 h-40" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter text-center">
                FOUNDRY.AI
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-light text-center">
              The Future of AI-Powered Marketing & Brand Intelligence
            </p>
          </motion.div>
          <motion.p
            className="text-sm sm:text-base text-white/50 mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
          >
            Leveraging Advanced Neural Networks & Decentralized GPU Power via IO.net
          </motion.p>
        </header>

        <Section className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Transform Your Marketing with AI Precision</h2>
          <p className="text-white/70 sm:text-lg mb-10 leading-relaxed">Foundry.AI combines cutting-edge AI with proven marketing psychology to generate high-converting copy and comprehensive brand identities in seconds.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: Sparkles, title: "Instant Generation", desc: "Get marketing assets in under 30 seconds." },
              { icon: Brain, title: "Psychology-Driven", desc: "Optimized using proven conversion principles." },
              { icon: Rocket, title: "Scale Ready", desc: "From startup MVPs to enterprise campaigns." }
            ].map((card, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-md">
                <card.icon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-white/60 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {[
            { type: 'copy', title: "Copy Intelligence", desc: "Generate high-converting marketing copy that drives action. Our AI analyzes successful campaigns to create compelling content that resonates and converts.", features: copyFeatures, buttonText: "Generate Copy", buttonIcon: Sparkles, action: onCopyGeneratorClick, gradient: "from-blue-500 to-cyan-500" },
            { type: 'brand', title: "Brand Intelligence", desc: "Build a complete brand foundation from the ground up. Our AI creates brand identities, including visual themes, audience analysis, and strategic roadmaps.", features: brandFeatures, buttonText: "Create Brand-Kit", buttonIcon: Palette, action: onBrandKitClick, gradient: "from-purple-600 to-pink-500" }
          ].map((card) => (
            <Section key={card.type}>
              <div
                className="relative bg-black/40 rounded-2xl p-6 sm:p-8 h-full flex flex-col border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-black/60"
              >
                <div className="flex-grow">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className={`relative mb-4 p-4 bg-white/10 rounded-full border border-white/10`}>
                      <card.buttonIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{card.title}</h2>
                  </div>
                  <p className="text-white/70 mb-8 text-center text-sm sm:text-base leading-relaxed">{card.desc}</p>
                  <div className="space-y-4 mb-8">
                    {card.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                        <feature.icon className={`w-6 h-6 ${card.type === 'brand' ? 'text-purple-300' : 'text-blue-300'} mt-1 flex-shrink-0`} />
                        <div>
                          <h4 className="text-white font-semibold">{feature.title}</h4>
                          <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.button
                  onClick={card.action}
                  className={`w-full mt-auto bg-gradient-to-r ${card.gradient} text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center`}
                  whileHover={{ scale: 1.05, boxShadow: `0px 0px 20px rgba(${card.type === 'brand' ? '192, 132, 252, 0.4' : '59, 130, 246, 0.4'})` }}
                  whileTap={{ scale: 0.95 }}
                >
                  <card.buttonIcon className="mr-2 w-5 h-5" />{card.buttonText}<ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </div>
            </Section>
          ))}
        </div>

        {/* This section now acts as a standard footer at the end of the page content */}
        <Section className="text-center text-white/40 text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-green-500" /><span>No Signup Required</span></div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /><span>Data Stored Locally</span></div>
            <div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-purple-500" /><span>Instant Results</span></div>
          </div>
        </Section>
        
      </div>
    </section>
  );
};

export default Hero;