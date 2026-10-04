import React, { useState } from 'react';
import { 
  Smartphone, 
  ExternalLink, 
  CheckCircle, 
  Table2, 
  ShieldCheck, 
  BellRing,
  Sparkles,
  Download,
  Globe
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface MobileAppSectionProps {
  currentLang: Language;
  onOpenStudio: () => void;
  onOpenInstall?: () => void;
}

export const MobileAppSection: React.FC<MobileAppSectionProps> = ({
  currentLang,
  onOpenStudio,
  onOpenInstall,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'records' | 'approvals'>('approvals');

  return (
    <section id="mobile" className="py-20 bg-slate-900/50 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text & Download CTAs */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile First Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.mobileTitle}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {t.mobileSubtitle} فاکتۆڕەکان لە کۆگا پەسەند بکە، زانیاری کڕیار لە کاتی کۆبوونەوە نوێبکەرەوە، و ئاگاداری ڕاستەوخۆ وەربگرە.
            </p>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>کاری ئۆفلاین (Offline Cache) و هاوئاهەنگی ئۆتۆماتیک</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>سکانکردنی بارکۆد و QR Code بە کامێرای مۆبایل</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>ئاگاداری خێرا (Push Notification) بۆ بڕیارەکانی ڕەزامەندی</span>
              </div>
            </div>

            {/* Direct Web & PWA Action (No store downloads needed) */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button 
                onClick={onOpenInstall || onOpenStudio}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer font-bold text-sm"
              >
                <Download className="w-5 h-5 text-white" />
                <div className="text-right">
                  <div className="text-[10px] text-indigo-200 uppercase font-sans tracking-wider">Progressive Web App</div>
                  <div>{t.installAsApp}</div>
                </div>
              </button>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-medium">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{t.availableOnStores}</span>
              </div>
            </div>

            {/* Official Website Reference Badge */}
            <div className="pt-4">
              <button
                onClick={onOpenStudio}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
              >
                <span>{t.officialSiteNotice}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Smartphone Mockup */}
          <div className="flex justify-center">
            <div className="relative w-[300px] h-[580px] rounded-[44px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              </div>

              {/* Phone Screen Content */}
              <div className="pt-8 flex-1 flex flex-col justify-between">
                
                {/* Mobile App Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                        ✦
                      </div>
                      <span className="text-xs font-bold text-white font-sans">{t.brandName}</span>
                    </div>
                    <BellRing className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Mobile Screen Segment Switcher */}
                  <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg my-3 text-[11px] font-semibold">
                    <button
                      onClick={() => setActiveTab('approvals')}
                      className={`py-1 rounded text-center transition-colors cursor-pointer ${
                        activeTab === 'approvals' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      داواکارییەکان
                    </button>
                    <button
                      onClick={() => setActiveTab('records')}
                      className={`py-1 rounded text-center transition-colors cursor-pointer ${
                        activeTab === 'records' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      فاکتۆڕەکان
                    </button>
                  </div>

                  {/* Active List in Phone */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-indigo-400">#INV-2026-081</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          پەسەندکراوە
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">سێرڤەری کلاود Enterprise Cloud</div>
                      <div className="text-[11px] font-mono text-slate-400">$13,125 • بەروار: 2026-09-18</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-indigo-400">#INV-2026-082</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                          چاوەڕوانی
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">ئامێری سکانەری پیشەسازی (Barcode Scanner)</div>
                      <div className="text-[11px] font-mono text-slate-400">$8,820 • کڕینی کەرەستە</div>
                      <div className="pt-1 flex gap-1">
                        <button className="flex-1 py-1 rounded bg-emerald-600 text-[10px] font-bold text-white">
                          پەسەندکردن
                        </button>
                        <button className="flex-1 py-1 rounded bg-rose-950 text-rose-300 text-[10px] font-bold">
                          ڕەتکردنەوە
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div className="pt-2 border-t border-slate-850 flex items-center justify-around text-slate-500">
                  <Table2 className="w-4 h-4 text-indigo-400" />
                  <Sparkles className="w-4 h-4" />
                  <ShieldCheck className="w-4 h-4" />
                </div>

              </div>

              {/* Bottom Home indicator */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
