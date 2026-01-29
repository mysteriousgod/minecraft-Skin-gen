import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Box, Download, Layers, ShieldCheck, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
              <Box className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              SkinCraft Pro
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link to="/details" className="text-slate-300 hover:text-white transition-colors">Documentation</Link>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
          </div>
          <Link 
            to="/editor" 
            className="glass-button bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-emerald-500/20"
          >
            Launch Editor
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">v2.0 Now Available</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Craft Your Perfect <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Minecraft Identity
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The most advanced 3D skin editor for Minecraft. Design, preview, and export high-quality skins directly from your browser with professional tools.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/editor" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              Start Creating <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/details" 
              className="px-8 py-4 rounded-xl glass-panel hover:bg-white/5 text-white font-medium text-lg transition-all duration-300 flex items-center gap-2"
            >
              Read Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Professional Grade Tools</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to create detailed, high-quality skins without the hassle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Box className="w-8 h-8 text-emerald-400" />}
              title="3D Live Preview"
              description="Rotate and inspect your skin in real-time 3D environment with lighting controls."
              delay="0s"
            />
            <FeatureCard 
              icon={<Paintbrush className="w-8 h-8 text-blue-400" />}
              title="Advanced Painting"
              description="Layer-based painting, precise color picking, and advanced brush tools."
              delay="0.1s"
            />
            <FeatureCard 
              icon={<Download className="w-8 h-8 text-violet-400" />}
              title="Instant Export"
              description="One-click export to standard Minecraft skin format. Ready to upload."
              delay="0.2s"
            />
            <FeatureCard 
              icon={<Layers className="w-8 h-8 text-pink-400" />}
              title="Layer Support"
              description="Toggle visibility of different body parts and overlay layers."
              delay="0.3s"
            />
             <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-orange-400" />}
              title="Safe & Secure"
              description="All processing happens in your browser. Your skins are your property."
              delay="0.4s"
            />
             <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Fast Performance"
              description="Optimized rendering engine runs smoothly on any modern device."
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Box className="text-emerald-500 w-6 h-6" />
              <span className="font-bold text-slate-200">SkinCraft Pro</span>
            </div>
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} SkinCraft Pro. Built for creators.
            </div>
            <div className="flex gap-6">
               <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Twitter</a>
               <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">GitHub</a>
               <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div className="glass-panel p-8 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:-translate-y-2 group" style={{ animationDelay: delay }}>
    <div className="mb-6 p-4 rounded-xl bg-slate-800/50 w-fit group-hover:bg-slate-800 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-100">{title}</h3>
    <p className="text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);
