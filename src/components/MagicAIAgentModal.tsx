import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Cpu, 
  TableProperties, 
  Calculator, 
  CheckCircle, 
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { DatabaseTable } from '../types/database';

interface MagicAIAgentModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  currentTable: DatabaseTable;
  onAddCustomTable: (table: DatabaseTable) => void;
}

export const MagicAIAgentModal: React.FC<MagicAIAgentModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  currentTable,
  onAddCustomTable,
}) => {
  const t = translations[currentLang];
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; hasSchema?: boolean }>>([
    {
      role: 'assistant',
      text: currentLang === 'ku'
        ? `سڵاو! من بریکاری ژیریی دەستکردی جادوو (Jadoo AI Agent)م. من دەتوانم:
• خشتە و قاڵبی داتابەیسی نوێ بۆت دروستبکەم.
• هاوکێشەی ژمێریاری و فۆرمولای ئاڵۆز بنووسم.
• شیکاری بۆ تۆمارەکانی ئێستات بکەم (${currentTable.nameKu}).
• پرۆسەی ڕەزامەندی ئۆتۆماتیک ڕێکبخەم.

چۆن دەتوانم ئەمڕۆ یارمەتیت بدەم؟`
        : currentLang === 'ar'
        ? `مرحباً! أنا وكيل الذكاء الاصطناعي لمنصة ساحر (Sahir AI Agent). كيف يمكنني مساعدتك في تصميم أو تحليل قاعدة بياناتك؟`
        : `Hello! I am the Wizard AI Agent. I can generate database schemas, write Excel formulas, audit records, and configure approval workflows. How can I help you today?`,
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: currentLang === 'ku' ? 'خشتەی فەرمانبەران و مووچە (HR & Payroll)' : 'HR & Payroll Schema',
      query: 'خشتەیەکی تەواو دروستبکە بۆ بەڕێوەبردنی فەرمانبەران، مووچەی بنەڕەتی، لێبڕین و پاداشت بە هاوکێشەی صافی مووچە.',
    },
    {
      label: currentLang === 'ku' ? 'هاوکێشەی حسابکردنی باج و قازانج' : 'Tax & Profit Formula',
      query: 'هاوکێشەی پێشکەوتوو بنووسە بۆ هەژمارکردنی قازانجی صافی لەدوای داشکاندن و باجی 15% لەسەر فاکتۆڕەکان.',
    },
    {
      label: currentLang === 'ku' ? 'شیکاری خێرای تۆمارەکانی ئێستا' : 'Audit Current Table Records',
      query: 'شیکاری بکە بۆ تۆمارەکانی ئەم خشتەیەی ئێستا و پێم بڵێ کام کڕیار یان باچ زۆرترین بەهای هەیە.',
    },
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const newHistory = [...chatHistory, { role: 'user' as const, text: userText }];
    setChatHistory(newHistory);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          currentTable,
          lang: currentLang,
        }),
      });

      const data = await response.json();
      const answer = data.result || 'داواکارییەکەت جێبەجێکرا.';
      const containsSchema = answer.includes('خشتە') || answer.includes('Fields') || answer.includes('Schema');

      setChatHistory([...newHistory, { role: 'assistant', text: answer, hasSchema: containsSchema }]);
    } catch (err) {
      setChatHistory([
        ...newHistory,
        {
          role: 'assistant',
          text: 'پەیوەندی لەگەڵ سێرڤەری Magic AI Agent بەردەوامە. لێرە دەتوانیت خشتەکان بە یەک کلیک لە ستۆدیۆ چالاک بکەیت.',
          hasSchema: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyHrSchema = () => {
    const hrTable: DatabaseTable = {
      id: `tbl-hr-${Date.now()}`,
      name: 'HR & Payroll Management',
      nameKu: 'سەرچاوە مرۆییەکان و مووچە (HR & Payroll)',
      nameAr: 'إدارة الموارد البشرية والرواتب',
      icon: 'Users',
      category: 'erp',
      descriptionKu: 'خشتەی دروستکراو لەلایەن Magic AI: بەڕێوەبردنی فەرمانبەران، مووچەی بنەڕەتی، باج و صافی وەرگرتن.',
      descriptionEn: 'AI-Generated Table: Employee records, basic salary, allowances, tax, and net payroll.',
      descriptionAr: 'جدول منشأ بواسطة وكيل الذكاء الاصطناعي لإدارة الموظفين والرواتب.',
      subTableTitleKu: 'پاداشت و کاتژمێری زیادە (Allowances Sub-Table)',
      fields: [
        { id: 'empName', name: 'Employee Name', nameKu: 'ناوی فەرمانبەر', nameAr: 'اسم الموظف', type: 'text', required: true, width: 170 },
        { id: 'dept', name: 'Department', nameKu: 'بەش', nameAr: 'القسم', type: 'dropdown', options: ['تەکنەلۆژیا (IT)', 'دارایی (Finance)', 'فرۆشتن (Sales)', 'بەڕێوەبردن (Admin)'], width: 150 },
        { id: 'baseSalary', name: 'Base Salary ($)', nameKu: 'مووچەی بنەڕەتی ($)', nameAr: 'الراتب الأساسي', type: 'currency', width: 140 },
        { id: 'bonus', name: 'Bonus ($)', nameKu: 'پاداشت ($)', nameAr: 'المكافأة', type: 'currency', width: 120 },
        { id: 'deduction', name: 'Deductions ($)', nameKu: 'لێبڕین ($)', nameAr: 'الخصومات', type: 'currency', width: 120 },
        { id: 'netSalary', name: 'Net Salary ($)', nameKu: 'صافی مووچە ($)', nameAr: 'صافي الراتب', type: 'formula', formula: 'baseSalary + bonus - deduction', width: 150 },
        { id: 'payoutStatus', name: 'Payout Status', nameKu: 'دۆخی وەرگرتن', nameAr: 'حالة الصرف', type: 'status', options: ['دراوە (Paid)', 'لە چاوەڕوانیدایە (Pending)', 'هەڵپەسێردراو (On Hold)'], width: 150 },
      ],
      records: [
        {
          id: 'hr-1',
          recordNumber: 'EMP-901',
          empName: 'دیدار نەجمەدین',
          dept: 'تەکنەلۆژیا (IT)',
          baseSalary: 2800,
          bonus: 400,
          deduction: 100,
          netSalary: 3100,
          payoutStatus: 'دراوە (Paid)',
          approvalStatus: 'approved',
          approvedBy: 'بەڕێوەبەری سەرچاوە مرۆییەکان',
          createdAt: '2026-09-01',
          updatedAt: '2026-09-24',
        },
        {
          id: 'hr-2',
          recordNumber: 'EMP-902',
          empName: 'شێنێ هۆشیار',
          dept: 'دارایی (Finance)',
          baseSalary: 2200,
          bonus: 250,
          deduction: 50,
          netSalary: 2400,
          payoutStatus: 'لە چاوەڕوانیدایە (Pending)',
          approvalStatus: 'pending',
          createdAt: '2026-09-01',
          updatedAt: '2026-09-25',
        },
      ],
    };

    onAddCustomTable(hrTable);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl h-[650px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {t.aiModalTitle}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.aiModalSubtitle}
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

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                <div className="whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {msg.hasSchema && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                      <TableProperties className="w-3.5 h-3.5" />
                      قاڵب ئامادەیە بۆ جێبەجێکردن
                    </span>
                    <button
                      onClick={handleApplyHrSchema}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>زیادکردنی ئەم خشتەیە بۆ ستۆدیۆ</span>
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center gap-2 text-xs text-purple-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>بریکاری ژیریی دەستکرد خەریکی بیرکردنەوە و شیکارییە...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Strip */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
            {t.aiSuggestedPrompts}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.query)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-950/60 hover:text-purple-300 hover:border-purple-500/40 border border-slate-700/60 text-slate-300 transition-colors cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(prompt);
            }}
            placeholder={t.aiPromptPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend(prompt)}
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t.aiSend}</span>
            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
