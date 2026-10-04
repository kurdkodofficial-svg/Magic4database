import React from 'react';
import { 
  Bot, 
  Sheet, 
  Workflow, 
  BarChart3, 
  Network, 
  Languages, 
  Search, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface FeaturesGridProps {
  currentLang: Language;
  onOpenStudio: () => void;
  onOpenAiAgent: () => void;
  onOpenIpShield: () => void;
  onOpenSeo: () => void;
  onSelectStudioView: (view: 'sheet' | 'gantt' | 'pivot' | 'approvals' | 'audit') => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  currentLang,
  onOpenStudio,
  onOpenAiAgent,
  onOpenIpShield,
  onOpenSeo,
  onSelectStudioView,
}) => {
  const t = translations[currentLang];

  const features = [
    {
      id: 'ai-agent',
      icon: Bot,
      title: t.featAiAgentTitle,
      description: t.featAiAgentDesc,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Autonomous AI',
      actionLabel: 'تاقیکردنەوەی AI Agent',
      onClick: onOpenAiAgent,
    },
    {
      id: 'simplicity',
      icon: Sheet,
      title: t.featSimplicityTitle,
      description: t.featSimplicityDesc,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Zero-Code',
      actionLabel: 'بینینی خشتەکان',
      onClick: () => {
        onSelectStudioView('sheet');
        onOpenStudio();
      },
    },
    {
      id: 'erp-crm',
      icon: Workflow,
      title: t.featErpCrmTitle,
      description: t.featErpCrmDesc,
      color: 'from-pink-500 to-rose-600',
      badge: 'Multi-tier Approvals',
      actionLabel: 'بۆردی ڕەزامەندییەکان',
      onClick: () => {
        onSelectStudioView('approvals');
        onOpenStudio();
      },
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: t.featAnalyticsTitle,
      description: t.featAnalyticsDesc,
      color: 'from-amber-500 to-orange-600',
      badge: 'Gantt & Pivot',
      actionLabel: 'بینینی گانت چارت',
      onClick: () => {
        onSelectStudioView('gantt');
        onOpenStudio();
      },
    },
    {
      id: 'integrations',
      icon: Network,
      title: t.featIntegrationsTitle,
      description: t.featIntegrationsDesc,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Webhooks & APIs',
      actionLabel: 'بەستنەوە بە Google / Zapier',
      onClick: () => {
        const el = document.getElementById('integrations');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'multilingual',
      icon: Languages,
      title: t.featMultilingualTitle,
      description: t.featMultilingualDesc,
      color: 'from-violet-500 to-purple-600',
      badge: 'Kurdish • English • Arabic',
      actionLabel: 'گۆڕینی زمان',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'seo',
      icon: Search,
      title: t.featSeoTitle,
      description: t.featSeoDesc,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Google SEO Optimization',
      actionLabel: 'پشکنینی کۆدی SEO',
      onClick: onOpenSeo,
    },
    {
      id: 'ip-shield',
      icon: ShieldAlert,
      title: t.featIpShieldTitle,
      description: t.featIpShieldDesc,
      color: 'from-red-500 to-rose-700',
      badge: 'Active Threat Block',
      actionLabel: 'کۆنسۆڵی IP Shield',
      onClick: onOpenIpShield,
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-900/40 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.featuresTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {t.featuresSubtitle}
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative rounded-2xl bg-slate-950/70 border border-slate-800/90 p-6 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-sans">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between">
                  <button
                    onClick={feat.onClick}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{feat.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
