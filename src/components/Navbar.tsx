import React from 'react';
import { 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Layers, 
  ExternalLink,
  Smartphone,
  ChevronDown,
  Download
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenStudio: () => void;
  onOpenAiAgent: () => void;
  onOpenIpShield: () => void;
  onOpenSeo: () => void;
  onOpenInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenStudio,
  onOpenAiAgent,
  onOpenIpShield,
  onOpenSeo,
  onOpenInstall,
}) => {
  const t = translations[currentLang];
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white font-sans">Magic</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ماجیک
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  {t.brandTagline}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors">
              {t.navFeatures}
            </a>
            <a href="#templates" className="hover:text-indigo-400 transition-colors">
              {t.navTemplates}
            </a>
            <button 
              onClick={onOpenAiAgent}
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.navAiAgent}</span>
            </button>
            <button 
              onClick={onOpenIpShield}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.navSecurity}</span>
            </button>
            <a href="#integrations" className="hover:text-indigo-400 transition-colors">
              {t.navIntegrations}
            </a>
            <a href="#comparison" className="hover:text-indigo-400 transition-colors">
              {t.navComparison}
            </a>
            <a href="#mobile" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.navMobile}</span>
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Install as App CTA Button */}
            <button
              onClick={onOpenInstall}
              title={t.installAppDesc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:text-white transition-all cursor-pointer shadow-sm shadow-indigo-500/20"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.installAsApp}</span>
            </button>

            {/* SEO Inspector Button */}
            <button
              onClick={onOpenSeo}
              title="SEO & Schema.org Inspector"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SEO</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {currentLang === 'ku' ? 'کوردی (سۆرانی)' : currentLang === 'ar' ? 'العربية' : 'English'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50">
                  <button
                    onClick={() => { onLanguageChange('ku'); setLangMenuOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentLang === 'ku' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    کوردی (سۆرانی)
                  </button>
                  <button
                    onClick={() => { onLanguageChange('ar'); setLangMenuOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentLang === 'ar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    العربية (Arabic)
                  </button>
                  <button
                    onClick={() => { onLanguageChange('en'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentLang === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Launch Studio CTA */}
            <button
              onClick={onOpenStudio}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{t.navStudio}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
