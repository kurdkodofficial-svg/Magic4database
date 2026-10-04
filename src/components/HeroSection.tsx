import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  Table2, 
  Cpu, 
  Zap, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface HeroSectionProps {
  currentLang: Language;
  onOpenStudio: () => void;
  onOpenAiAgent: () => void;
  onOpenIpShield: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onOpenStudio,
  onOpenAiAgent,
  onOpenIpShield,
}) => {
  const t = translations[currentLang];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-12 right-10 w-96 h-96 bg-blue-600/10 blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.heroBadge}</span>
          </div>

          <button 
            onClick={onOpenStudio}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
          >
            <span>{t.officialSiteNotice}</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </button>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {t.brandName}
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-200">
              {t.heroHeadline}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {t.heroSubheadline}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenStudio}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Table2 className="w-5 h-5" />
              <span>{t.ctaLaunchStudio}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={onOpenAiAgent}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/50 hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>{t.aiAssistantBtn}</span>
            </button>

            <button
              onClick={onOpenIpShield}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold text-emerald-300 bg-slate-900 border border-emerald-500/30 hover:bg-emerald-950/30 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.featIpShieldTitle}</span>
            </button>
          </div>

          {/* Trust bullet points */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>سادە وەک ئێکسڵ (Excel-like)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>بەستراوە بە AI Agent</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ڕەزامەندی فرەقۆناغی (Approval Workflow)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>پشتیوانی سێ زمانی (کوردی، ئینگلیزی، عەرەبی)</span>
            </div>
          </div>
        </div>

        {/* Interactive Hero Spreadsheet & AI Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          {/* Card Topbar */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Table2 className="w-3.5 h-3.5 text-indigo-400" />
                Magic ERP Database • فاکتۆڕ و فرۆشتنی مانگانە
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-medium flex items-center gap-1 border border-amber-500/20">
                {currentLang === 'ku' 
                  ? 'پڕۆژەکان نموونەن — بەبێ ناوی کڕیار تا خۆت بینوسیت' 
                  : currentLang === 'ar' 
                  ? 'مشاريع نموذجية — بدون اسم عميل حتى تقوم بإدخاله' 
                  : 'Sample projects — customer name left blank for your input'}
              </span>
              <button
                onClick={onOpenStudio}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 cursor-pointer"
              >
                تەواوی ستۆدیۆ بکەرەوە
              </button>
            </div>
          </div>

          {/* Mini Interactive Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right sm:text-sm">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800">
                  <th className="p-3">ژمارەی فاکتۆڕ</th>
                  <th className="p-3">ناوی کڕیار (Customer)</th>
                  <th className="p-3">بڕی پێش باج</th>
                  <th className="p-3">باج (%)</th>
                  <th className="p-3">کۆی گشتی (Formula)</th>
                  <th className="p-3">دۆخی ڕەزامەندی</th>
                  <th className="p-3 text-center">کردار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-400">#INV-2026-081</td>
                  <td className="p-3 text-slate-400 font-sans italic text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      [ بەتاڵە — ناوی کڕیار بنووسە ]
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">$12,500</td>
                  <td className="p-3 text-slate-400">5%</td>
                  <td className="p-3 font-bold text-emerald-400">$13,125</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      پەسەندکراوە (Approved)
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={onOpenStudio} 
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      بینین
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-400">#INV-2026-082</td>
                  <td className="p-3 text-white font-medium">گرووپی بازرگانی زاگرۆس</td>
                  <td className="p-3 text-slate-300">$8,400</td>
                  <td className="p-3 text-slate-400">5%</td>
                  <td className="p-3 font-bold text-emerald-400">$8,820</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      لە چاوەڕوانیدایە (Pending)
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={onOpenStudio} 
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      بڕیاردان
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom AI Suggestion Prompt Strip */}
          <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>پێشنیاری Magic AI Agent:</strong> لە کۆی 4 فاکتۆڕ، 2 داواکاری لە چاوەڕوانی ڕەزامەندیدان. ئایا ئاگاداری ڕەوانە بکەم بۆ CFO؟
              </span>
            </div>
            <button
              onClick={onOpenAiAgent}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer"
            >
              کردنەوەی AI Agent
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-sans">0</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">کۆدنوسین (No-Code)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-sans">10x</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">خێراتر لە دروستکردن</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-sans">80%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">کەمکردنەوەی تێچوو</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-sans">3</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">زمانی تەواو (سۆرانی، ئینگلیزی، عەرەبی)</div>
          </div>
        </div>

      </div>
    </section>
  );
};
