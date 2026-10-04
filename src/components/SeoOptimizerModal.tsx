import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Copy, 
  Check, 
  Globe, 
  Share2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface SeoOptimizerModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const SeoOptimizerModal: React.FC<SeoOptimizerModalProps> = ({
  currentLang,
  isOpen,
  onClose,
}) => {
  const t = translations[currentLang];
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://magic-database.com';

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Magic (ماجیک)',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'All',
    'description': t.heroSubheadline,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'ratingCount': '1420',
    },
    'keywords': 'No-code database, No-code website builder, Kurdish ERP, Magic database, Enterprise platform, CRM, Gantt chart, AI Agent, IP shield',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl h-[650px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t.seoModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Google SEO Optimization, OpenGraph & Schema.org Structured Data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Google Search Result Preview Card */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{t.seoGooglePreview}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-md space-y-1.5 text-left font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] text-white font-bold">
                  M
                </div>
                <span>magic-database.com › ku › no-code-erp</span>
              </div>
              <h4 className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer">
                {t.brandName} - {t.heroHeadline}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {t.heroSubheadline} بەستراوە بە بریکاری ژیریی دەستکرد (AI Agent)، بەڕێوەبردنی سەرچاوەی کار (ERP)، گانت چارت، CRM و پاراستنی ئاسایشی ئەلیکترۆنی.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span className="text-amber-500 font-bold">★★★★★ 4.9</span>
                <span>• (1,420 هەڵسەنگاندن)</span>
                <span>• خۆڕایی بۆ تاقیکردنەوە</span>
              </div>
            </div>
          </div>

          {/* Social OpenGraph Share Card Preview */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>پێشبینینی کارتی تۆڕە کۆمەڵایەتییەکان (OpenGraph Social Card)</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
              <div className="h-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    MAGIC NO-CODE DATABASE
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-xl font-black text-white">
                  ماجیک: ئامرازی دروستکردنی داتابەیس بێ کۆد
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 text-xs text-slate-400 flex items-center justify-between">
                <span>https://magic-database.com</span>
                <span className="text-indigo-400 font-semibold">پشتیوانی کوردی، ئینگلیزی و عەرەبی</span>
              </div>
            </div>
          </div>

          {/* JSON-LD Schema Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>{t.seoSchemaLd}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کۆپیکرا!' : t.seoCopySnippet}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto text-left">
              {JSON.stringify(schemaJson, null, 2)}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
