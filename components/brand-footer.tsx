
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { BRAND_INFO } from '../seagull-brand-config';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  // 动态生成Footer链接（支持多语言）
  const footerLinks = {
    company: [
      { name: t.footer.brandStory, path: '/about' },
      { name: t.footer.craftsmanship, path: '#' },
      { name: t.footer.brandNews, path: '#' },
    ],
    support: [
      { name: t.footer.afterSales, path: '#' },
      { name: t.footer.contactUs, path: '#' },
      { name: t.footer.warranty, path: '#' },
    ],
    legal: [
      { name: t.footer.privacyPolicy, path: '#' },
      { name: t.footer.termsOfService, path: '#' },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-slate-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              {BRAND_INFO.logoSvg}
              <span className="text-xl font-serif font-bold text-brand-text">
                {BRAND_INFO.name}
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.brand.tagline}
            </p>
            <p className="text-sm mt-2 text-slate-500">
              {language === 'zh' ? t.brand.chineseName : t.brand.name}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="font-semibold text-brand-text mb-4 text-base">
              {t.footer.company}
            </h5>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-brand-primary transition-colors duration-200 text-sm text-slate-600 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h5 className="font-semibold text-brand-text mb-4 text-base">
              {t.footer.support}
            </h5>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-brand-primary transition-colors duration-200 text-sm text-slate-600 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h5 className="font-semibold text-brand-text mb-4 text-base">
              {t.footer.legal}
            </h5>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-brand-primary transition-colors duration-200 text-sm text-slate-600 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright and Heritage */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-slate-500 mb-2">
            &copy; {new Date().getFullYear()} {language === 'zh' ? t.brand.chineseName : t.brand.name}. {t.footer.copyright}.
          </p>
          <p className="text-xs text-slate-400">
            {t.footer.heritage}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
