import React from 'react';
import { 
  Database, 
  ExternalLink, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  Globe
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface FooterProps {
  currentLang: Language;
  onOpenStudio: () => void;
  onOpenAiAgent: () => void;
  onOpenIpShield: () => void;
  onOpenSeo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenStudio,
  onOpenAiAgent,
  onOpenIpShield,
  onOpenSeo,
}) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                <Database className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white font-sans">{t.brandName}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t.footerAbout}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>سیستەم و خزمەتگوزارییەکان 100% کاران (All Systems Operational)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">بەشە سەرەکییەکان</div>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  {t.navFeatures}
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  {t.navTemplates}
                </a>
              </li>
              <li>
                <button onClick={onOpenStudio} className="hover:text-white transition-colors text-right cursor-pointer">
                  {t.navStudio}
                </button>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  {t.navComparison}
                </a>
              </li>
            </ul>
          </div>

          {/* Tools & Security */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">ئامرازەکان و پاراستن</div>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenAiAgent} className="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.navAiAgent}</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenIpShield} className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.navSecurity}</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenSeo} className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{t.featSeoTitle}</span>
                </button>
              </li>
              <li>
                <a href="#mobile-app" className="hover:text-white transition-colors">
                  {t.navMobile}
                </a>
              </li>
            </ul>
          </div>

          {/* Official Source & Reference */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">
              {currentLang === 'ku' ? 'پلاتفۆرمی فەرمی' : currentLang === 'ar' ? 'المنصة الرسمية' : 'Official Platform'}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {currentLang === 'ku'
                ? 'جادوو (Jadoo) پلاتفۆرمی پێشکەوتووی بنکەی داتا و ماڵپەڕسازە بەبێ کۆدنوسین لەگەڵ بریکاری ژیریی دەستکرد (AI Agent) و پاراستنی ئاسایشی ئەلیکترۆنی.'
                : currentLang === 'ar'
                ? 'ساحر (Sahir) منصة متقدمة لقواعد البيانات وبناء المواقع بدون كتابة كود مع وكيل الذكاء الاصطناعي والحماية المتقدمة.'
                : 'Wizard is an enterprise-grade no-code relational database and web app engine powered by autonomous AI agents.'}
            </p>
            <div>
              <button
                onClick={onOpenStudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <span>{t.officialSiteBtn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {t.footerRights}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{t.footerKurdishTech}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
