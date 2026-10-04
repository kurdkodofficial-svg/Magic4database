import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  TrendingDown, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ComparisonSectionProps {
  currentLang: Language;
  onOpenStudio: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  currentLang,
  onOpenStudio,
}) => {
  const t = translations[currentLang];
  const [usersCount, setUsersCount] = useState<number>(15);

  // Cost calculation: Salesforce avg ~$150/user/mo + setup fee ($10,000)
  // Magic = $25/user/mo, $0 setup fee
  const salesforceYearly = usersCount * 150 * 12 + 10000;
  const magicYearly = usersCount * 25 * 12;
  const savings = salesforceYearly - magicYearly;

  const comparisonRows = [
    {
      feature: 'تێچووی مانگانە و ڕێکخستنی سەرەتایی',
      featureEn: 'Licensing & Setup Fees',
      magic: 'زۆر کەم ($25/بەکارهێنەر) بەبێ پارەی جێبەجێکردن',
      salesforce: 'زۆر گران ($150/بەکارهێنەر) + هەزاران دۆلار بۆ ڕاوێژکار',
      excel: 'هەرزان بەڵام مەترسیدار و بێ بنکەی دادەی ڕاستەقینە',
    },
    {
      feature: 'خێرایی خستنەکار (Deployment Speed)',
      featureEn: 'Time to Value / Deployment',
      magic: 'چەند کاتژمێر یان چەند ڕۆژێک بەبێ کۆد',
      salesforce: '3 بۆ 9 مانگ لە ڕاوێژکاری و کۆدنوسین',
      excel: 'خێرا بەڵام بە زوویی پشێوی دروستدەکات',
    },
    {
      feature: 'بریکاری ژیریی دەستکردی خۆماڵی (Native AI Agent)',
      featureEn: 'Autonomous AI Agent',
      magic: 'بەستراوی ڕاستەوخۆ بەبێ ڕێکخستنی ئاڵۆز',
      salesforce: 'پێویستی بە کڕینی مۆدیوولی Einstein ی گرانبەهایە',
      excel: 'بوونی نییە لە داتای پەیوەندیداردا',
    },
    {
      feature: 'پرۆسەی ڕەزامەندی فرەقۆناغی (Approval Workflows)',
      featureEn: 'Multi-tier Approval Workflows',
      magic: 'ئامادەکراو بە یەک کلیک بۆ CFO و بەڕێوەبەر',
      salesforce: 'ئاڵۆز و پێویستی بە ئەندازیاری پسپۆڕ هەیە',
      excel: 'نییە - تەنها ئیمەیل و پەیوەندی شەخسی',
    },
    {
      feature: 'پاراستنی ئەلیکترۆنی و بلۆککردنی IP',
      featureEn: 'IP Shield & Automated Threat Block',
      magic: 'سیستەمی IP Shield ناوەکی و تۆماری وردی گۆڕانکاری',
      salesforce: 'تەنها لە پاکێجی Enterprise گرانبەهادا هەیە',
      excel: 'سفر - فایل دەدزرێت یان تێکدەچێت بە ئاسانی',
    },
    {
      feature: 'پشتیوانی سێ زمان (کوردی، ئینگلیزی، عەرەبی)',
      featureEn: 'Trilingual Kurdish, English, Arabic RTL',
      magic: '100% دیزاین و فۆنتی ڕەسەنی RTL و سۆرانی',
      salesforce: 'کوردی فەرمی تێدا نییە و تەنها ئینگلیزی/عەرەبی بەشی هەیە',
      excel: 'پشتگیری سادەی دەق بەبێ ڕووکاری کوردی',
    },
  ];

  return (
    <section id="comparison" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Unmatched Value & ROI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.whyTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {t.whySubtitle}
          </p>
        </div>

        {/* 3 Value Pillars from user prompt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {t.whyCostTitle}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.whyCostDesc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {t.whySpeedTitle}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.whySpeedDesc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {t.whySecurityTitle}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.whySecurityDesc}
            </p>
          </div>
        </div>

        {/* Interactive Savings Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl mb-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                ژمێرەری پاشەکەوتی ساڵانە (Annual Savings Calculator)
              </span>
              <h4 className="text-xl font-bold text-white">
                بڕی پاشەکەوت بکە بە جێگرتنەوەی Salesforce بە Magic
              </h4>
              <p className="text-xs text-slate-300">
                ژمارەی فەرمانبەران / بەکارهێنەرانی کۆمپانیاکەت دیاریبکە:
              </p>
              <div className="flex items-center gap-4 pt-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={usersCount}
                  onChange={(e) => setUsersCount(Number(e.target.value))}
                  className="w-48 accent-indigo-500 cursor-pointer"
                />
                <span className="text-lg font-mono font-bold text-indigo-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                  {usersCount} بەکارهێنەر
                </span>
              </div>
            </div>

            <div className="text-right sm:text-left space-y-1">
              <div className="text-xs text-slate-400">تێچووی ساڵانەی پاشەکەوتکراو:</div>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                ${savings.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400 font-semibold">
                بە ڕێژەی {Math.round((savings / salesforceYearly) * 100)}% کەمتر لە تێچووی Salesforce
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-4 sm:p-5">تایبەتمەندییەکان</th>
                <th className="p-4 sm:p-5 bg-indigo-950/40 text-indigo-300 font-extrabold border-x border-indigo-500/30">
                  ماجیک (Magic)
                </th>
                <th className="p-4 sm:p-5">{t.vsSalesforce}</th>
                <th className="p-4 sm:p-5">{t.vsExcel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                  <td className="p-4 sm:p-5 text-white font-bold">
                    {row.feature}
                  </td>
                  <td className="p-4 sm:p-5 bg-indigo-950/20 font-bold text-emerald-300 border-x border-indigo-500/20">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{row.magic}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{row.salesforce}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{row.excel}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
