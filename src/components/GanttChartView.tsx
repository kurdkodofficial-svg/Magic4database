import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  User,
  Plus
} from 'lucide-react';
import { DatabaseTable } from '../types/database';
import { Language } from '../i18n/translations';

interface GanttChartViewProps {
  currentLang: Language;
  table: DatabaseTable;
}

export const GanttChartView: React.FC<GanttChartViewProps> = ({
  currentLang,
  table,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Days range for the visual Gantt timeline (e.g. Sept 01 - Oct 25)
  const timelineDates = [
    { label: '01 Sep', day: '1' },
    { label: '05 Sep', day: '5' },
    { label: '10 Sep', day: '10' },
    { label: '15 Sep', day: '15' },
    { label: '20 Sep', day: '20' },
    { label: '25 Sep', day: '25' },
    { label: '30 Sep', day: '30' },
    { label: '05 Oct', day: '5' },
    { label: '10 Oct', day: '10' },
    { label: '15 Oct', day: '15' },
    { label: '20 Oct', day: '20' },
  ];

  // Map table records to Gantt rows
  const tasks = table.records.map((rec, idx) => {
    const name = rec.taskName?.trim() || rec.productName?.trim() || rec.customer?.trim() || rec.leadName?.trim() || `${currentLang === 'ku' ? 'پڕۆژەی نموونە' : 'Project'} #${rec.recordNumber}`;
    const assignee = rec.assignee?.trim() || rec.factoryLead?.trim() || rec.salesRep?.trim() || rec.owner?.trim() || (currentLang === 'ku' ? 'لە چاوەڕوانی دانان' : 'Unassigned');
    const progress = rec.progress !== undefined ? rec.progress : rec.approvalStatus === 'approved' ? 100 : rec.approvalStatus === 'pending' ? 60 : 20;
    const startDate = rec.startDate || rec.scheduledDate || rec.invoiceDate || '2026-09-05';
    const dueDate = rec.dueDate || '2026-10-15';
    const status = rec.status || rec.lineStatus || rec.paymentStatus || rec.stage || 'لە کارکردندایە';

    // Calculate simulated position on timeline (0 - 100%)
    const startOffset = Math.min(Math.max((idx * 16) + 4, 2), 65);
    const duration = Math.min(Math.max(25 + (idx % 3) * 12, 18), 95 - startOffset);

    return {
      id: rec.id,
      number: rec.recordNumber,
      name,
      assignee,
      progress,
      startDate,
      dueDate,
      status,
      startOffset,
      duration,
      approvalStatus: rec.approvalStatus,
    };
  });

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.approvalStatus === filterStatus);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              نەخشەی زەمەنی گانت چارت (Interactive Gantt Chart)
            </h3>
            <p className="text-xs text-slate-400">
              بەدواداچوون بۆ کاتژمێر، ماوەی جێبەجێکردن، پێشکەوتن و سەرۆک تیمەکان
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> فلتەر:
          </span>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              هەموو ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterStatus === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              پەسەندکراو
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterStatus === 'pending' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              لە چاوەڕوانیدا
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Visual Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          
          {/* Timeline Date Header */}
          <div className="grid grid-cols-12 gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-400 text-center">
            <div className="col-span-4 text-right pr-2">ئەرک و زانیاری</div>
            <div className="col-span-8 grid grid-cols-11 text-[11px] font-mono text-slate-500">
              {timelineDates.map((d, i) => (
                <div key={i} className="border-r border-slate-800/80 px-1 truncate">
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          {/* Task Timeline Bars */}
          <div className="divide-y divide-slate-850 py-2 space-y-3">
            {filteredTasks.map((t) => (
              <div key={t.id} className="grid grid-cols-12 gap-2 items-center py-2.5 hover:bg-slate-850/50 rounded-lg px-2 transition-colors">
                
                {/* Task Meta Column */}
                <div className="col-span-4 space-y-1 pr-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {t.number}
                    </span>
                    <span className="text-xs font-semibold text-white truncate max-w-[200px]" title={t.name}>
                      {t.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {t.assignee}
                    </span>
                    <span className="text-indigo-300 font-semibold font-mono">
                      {t.progress}%
                    </span>
                  </div>
                </div>

                {/* Visual Gantt Bar Column */}
                <div className="col-span-8 relative h-9 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center px-1 overflow-hidden">
                  
                  {/* Grid vertical markers */}
                  <div className="absolute inset-0 grid grid-cols-11 pointer-events-none opacity-20">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="border-r border-slate-600 h-full" />
                    ))}
                  </div>

                  {/* Active Bar */}
                  <div
                    style={{
                      marginRight: `${t.startOffset}%`,
                      width: `${t.duration}%`,
                    }}
                    className={`relative h-6 rounded-md shadow-md flex items-center justify-between px-2 text-[11px] font-bold text-white transition-all group cursor-pointer ${
                      t.approvalStatus === 'approved' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-900/40' 
                        : t.approvalStatus === 'pending'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-500 shadow-amber-900/40'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-500 shadow-indigo-900/40'
                    }`}
                  >
                    <span className="truncate max-w-[120px] font-sans">
                      {t.status}
                    </span>
                    <span className="font-mono text-[10px] bg-black/30 px-1 rounded">
                      {t.progress}%
                    </span>

                    {/* Progress Fill Indicator */}
                    <div
                      style={{ width: `${t.progress}%` }}
                      className="absolute bottom-0 right-0 h-1 bg-white/70 rounded-full"
                    />
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Gantt Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span>تەواوبوو / پەسەندکراو</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>لە جێبەجێکردن / چاوەڕوانی</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500"></span>
            <span>پلان دانراو</span>
          </div>
        </div>

        <div className="text-slate-400 text-xs">
          ئۆتۆماتیکی لەگەڵ داتابەیسی Magic هاوئاهەنگ دەبێت
        </div>
      </div>

    </div>
  );
};
