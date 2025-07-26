import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { BRAND_INFO } from '../seagull-brand-config';

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 py-20 md:py-32 rounded-xl shadow-lg overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url('images/seagull_hero_banner_1963pilot_main.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/60 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-800 mb-6 leading-tight">
          {t.home.heroTitle}: 
          <span 
            className="ml-2"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t.home.heroTagline}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t.home.heroDescription}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link 
            to="/products" 
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            {t.home.exploreProducts}
          </Link>
          <Link 
            to="/about" 
            className="border-2 border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              borderColor: '#3b82f6',
              color: '#3b82f6'
            }}
          >
            {t.home.craftsmanship}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
