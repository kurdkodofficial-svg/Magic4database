import React from 'react';
import { 
  Building2, 
  Users2, 
  Boxes, 
  FolderKanban, 
  ArrowRight, 
  TableProperties, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { initialTables } from '../data/initialTemplates';

interface TemplatesShowcaseProps {
  currentLang: Language;
  onSelectTable: (tableId: string) => void;
  onOpenStudio: () => void;
}

export const TemplatesShowcase: React.FC<TemplatesShowcaseProps> = ({
  currentLang,
  onSelectTable,
  onOpenStudio,
}) => {
  const t = translations[currentLang];

  const templateIcons = {
    'tbl-erp': Building2,
    'tbl-crm': Users2,
    'tbl-bom': Boxes,
    'tbl-projects': FolderKanban,
  };

  return (
    <section id="templates" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-3">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Ready-to-Deploy Blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.templatesTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {t.templatesSubtitle}
          </p>
        </div>

        {/* 4 Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initialTables.map((tbl) => {
            const Icon = templateIcons[tbl.id as keyof typeof templateIcons] || TableProperties;
            const title = currentLang === 'ku' ? tbl.nameKu : currentLang === 'ar' ? tbl.nameAr : tbl.name;
            const desc = currentLang === 'ku' ? tbl.descriptionKu : currentLang === 'ar' ? tbl.descriptionAr : tbl.descriptionEn;

            return (
              <div
                key={tbl.id}
                className="group relative rounded-3xl bg-slate-900/70 border border-slate-800 p-7 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                          {tbl.category.toUpperCase()} TEMPLATE
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {desc}
                  </p>

                  {/* Highlights pills */}
                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-semibold text-slate-400 mb-2">
                      خانە سەرەکییەکان (Key Schema Fields):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tbl.fields.slice(0, 5).map((f) => (
                        <span
                          key={f.id}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                        >
                          {currentLang === 'ku' ? f.nameKu : currentLang === 'ar' ? f.nameAr : f.name}
                        </span>
                      ))}
                      {tbl.fields.length > 5 && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-slate-800/80 text-slate-400 font-mono">
                          +{tbl.fields.length - 5} زیاتر
                        </span>
                      )}
                    </div>
                  </div>

                  {tbl.subTableTitleKu && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium text-slate-300">
                        {currentLang === 'ku' ? tbl.subTableTitleKu : tbl.subTableTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-semibold text-[11px]">
                        Magic Relational Subtable
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span className="font-bold text-white">{tbl.records.length}</span> تۆماری نموونەیی ئامادەکراو
                  </div>

                  <button
                    onClick={() => {
                      onSelectTable(tbl.id);
                      onOpenStudio();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <span>{t.openInStudio}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
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
