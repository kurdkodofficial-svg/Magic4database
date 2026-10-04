import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  ChevronRight, 
  User, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { DatabaseTable, DatabaseRecord, ApprovalStatus } from '../types/database';
import { Language, translations } from '../i18n/translations';

interface ApprovalWorkflowViewProps {
  currentLang: Language;
  table: DatabaseTable;
  onSelectRecord: (record: DatabaseRecord) => void;
  onUpdateApproval: (recordId: string, status: ApprovalStatus, approverName?: string) => void;
}

export const ApprovalWorkflowView: React.FC<ApprovalWorkflowViewProps> = ({
  currentLang,
  table,
  onSelectRecord,
  onUpdateApproval,
}) => {
  const t = translations[currentLang];

  const columns: { status: ApprovalStatus; title: string; color: string; icon: any }[] = [
    { status: 'draft', title: t.draftBadge, color: 'border-slate-700 bg-slate-900/50', icon: FileText },
    { status: 'pending', title: t.pendingBadge, color: 'border-amber-500/40 bg-amber-950/10', icon: Clock },
    { status: 'approved', title: t.approvedBadge, color: 'border-emerald-500/40 bg-emerald-950/10', icon: CheckCircle },
    { status: 'rejected', title: t.rejectedBadge, color: 'border-rose-500/40 bg-rose-950/10', icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            بۆردی بەڕێوەبردنی ڕەزامەندییەکان (Approval Workflow Board)
          </h3>
          <p className="text-xs text-slate-400">
            کلیک لەسەر هەر تۆمارێک بکە بۆ بینینی وردەکاری و واژۆکردنی بەڕێوەبەر
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>{currentLang === 'ku' ? 'پڕۆژەکان نموونەن — ناوی کڕیار بەتاڵە بۆ تۆ' : 'Sample projects — customer names ready for your input'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const ColIcon = col.icon;
          const recordsInCol = table.records.filter((r) => r.approvalStatus === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-2xl border ${col.color} p-4 flex flex-col min-h-[450px] shadow-lg`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.title}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {recordsInCol.length}
                </span>
              </div>

              {/* Records in column */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {recordsInCol.map((rec) => {
                  const title = rec.customer?.trim() || rec.leadName?.trim() || rec.productName?.trim() || rec.taskName?.trim() || `${currentLang === 'ku' ? 'پڕۆژەی نموونە' : 'Sample'} #${rec.recordNumber}`;
                  const value = rec.totalAmount || rec.dealValue || rec.totalBatchCost;
                  const owner = rec.salesRep?.trim() || rec.owner?.trim() || rec.factoryLead?.trim() || rec.assignee?.trim();

                  return (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecord(rec)}
                      className="group p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 transition-all cursor-pointer shadow-md space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-400">
                          #{rec.recordNumber}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                      </div>

                      <div className="text-xs font-bold text-white line-clamp-1">
                        {title}
                      </div>

                      {value !== undefined && (
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          ${Number(value).toLocaleString()}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <span className="flex items-center gap-1 text-[10px]">
                          <User className="w-3 h-3 text-slate-500" />
                          <span className={owner ? 'text-slate-300' : 'text-slate-500 italic'}>
                            {owner || (currentLang === 'ku' ? 'لە چاوەڕوانی دانان' : 'Unassigned')}
                          </span>
                        </span>
                        <span className="text-slate-500 font-mono">
                          {rec.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {recordsInCol.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-500 italic border border-dashed border-slate-800/80 rounded-xl">
                    هیچ داواکارییەک لەم قۆناغەدا نییە
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
