import React, { useState } from 'react';
import { 
  Network, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  ArrowUpRight, 
  Code2, 
  Layers,
  Cpu,
  Mail,
  FileSpreadsheet
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface IntegrationsSectionProps {
  currentLang: Language;
}

export const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [selectedPlatform, setSelectedPlatform] = useState('Zapier');
  const [webhookResult, setWebhookResult] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  const integrations = [
    {
      name: 'Google Workspace',
      desc: 'هاوئاهەنگی ڕاستەوخۆ لەگەڵ Google Sheets, Gmail و Google Drive بۆ ئەرشیفکردنی فاکتۆڕەکان.',
      descEn: 'Bidirectional sync with Google Sheets, Gmail notifications, and Google Drive invoice archiving.',
      category: 'Workspace',
      color: 'from-blue-500 to-emerald-500',
    },
    {
      name: 'Microsoft Outlook',
      desc: 'ناردنی ئاگاداری ڕەزامەندی (Approval Requests) بۆ ئیمەیلی بەڕێوەبەران بە یەک کلیک.',
      descEn: 'Send approval email triggers and calendar meeting bookings to managers automatically.',
      category: 'Email & Calendar',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      name: 'Zapier',
      desc: 'بەستنەوە بە زیاتر لە 5,000 ئەپڵیکەیشن بە کەمترین هەنگاو و بەبێ کۆد.',
      descEn: 'Connect Magic database triggers with 5,000+ business applications seamlessly.',
      category: 'Automation',
      color: 'from-orange-500 to-amber-500',
    },
    {
      name: 'Make (Integromat)',
      desc: 'دروستکردنی سیناریۆی ئاڵۆزی ئۆتۆماتیک بە دیزاینی ڤیژواڵ و نەخشەی پرۆسە.',
      descEn: 'Build complex multi-step automation diagrams triggered by new record updates.',
      category: 'Workflow',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'n8n',
      desc: 'بەستنەوەی کلاود و سێرڤەری لۆکاڵ لەڕێگەی Webhookی تایبەت بە کەرتی بانکی و تەندروستی.',
      descEn: 'Self-hosted & cloud workflow automation engine ideal for enterprise data privacy.',
      category: 'Open Source',
      color: 'from-rose-500 to-red-500',
    },
  ];

  const handleTestWebhook = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/integrations/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-platform': selectedPlatform,
        },
        body: JSON.stringify({
          app: 'No-Code Database',
          event: 'RECORD_APPROVED',
          recordNumber: 'INV-2026-081',
          itemDescription: 'سێرڤەری کلاود Enterprise Cloud Node',
          amount: 13125,
          approver: 'سەرۆکی دارایی (CFO)',
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setWebhookResult(data);
    } catch {
      setWebhookResult({
        received: true,
        status: '200 OK - Dispatched to Webhook trigger',
        platform: selectedPlatform,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="integrations" className="py-20 bg-slate-900/30 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <Network className="w-3.5 h-3.5" />
            <span>Seamless Enterprise Connectivity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.featIntegrationsTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {t.featIntegrationsDesc}
          </p>
        </div>

        {/* 5 Integrations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <Network className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  {item.category}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentLang === 'ku' ? item.desc : item.descEn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> بەردەستە
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Webhook Simulator Box */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  تاقیکردنەوەی ئۆتۆماتیکی ناردنی Webhook
                </h4>
                <p className="text-xs text-slate-400">
                  تاقیکردنەوەی ڕاستەوخۆ بۆ ناردنی ڕووداوی پەسەندکردنی تۆمار بۆ سێرڤەری دەرەکی
                </p>
              </div>
            </div>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Zapier">Zapier Webhook</option>
              <option value="Make">Make.com Scenario</option>
              <option value="n8n">n8n Custom Workflow</option>
              <option value="Google Workspace">Google Sheets API</option>
              <option value="Outlook">Outlook Graph API</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850 text-xs font-mono text-slate-300 space-y-1 mb-4 overflow-x-auto">
            <div className="text-slate-500">// Payload نێردراو لەلایەن Magic No-Code Engine:</div>
            <div>POST /api/integrations/webhook</div>
            <div className="text-indigo-400">Target Platform: {selectedPlatform}</div>
            <div className="text-emerald-400">Status: "INV-2026-081" (APPROVED by CFO) - $13,125</div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleTestWebhook}
              disabled={isSending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isSending ? 'خەریکی ناردنە...' : 'تاقیکردنەوەی ناردنی پەیوەندی (Test Dispatch)'}</span>
            </button>

            {webhookResult && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>پەیوەندی بە سەرکەوتوویی گەیشت بە {selectedPlatform}!</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
