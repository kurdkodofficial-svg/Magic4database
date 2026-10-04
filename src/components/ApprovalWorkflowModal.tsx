import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Send, 
  UserCheck, 
  Calendar,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { DatabaseRecord, DatabaseTable, ApprovalStatus } from '../types/database';
import { Language, translations } from '../i18n/translations';
import { exportTableToCsv, exportTableToPdf } from '../utils/exportUtils';

interface ApprovalWorkflowModalProps {
  currentLang: Language;
  table: DatabaseTable;
  record: DatabaseRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApproval: (recordId: string, status: ApprovalStatus, approverName?: string) => void;
}

export const ApprovalWorkflowModal: React.FC<ApprovalWorkflowModalProps> = ({
  currentLang,
  table,
  record,
  isOpen,
  onClose,
  onUpdateApproval,
}) => {
  const t = translations[currentLang];
  const [approverName, setApproverName] = useState('بەڕێوەبەری دارایی (CFO)');
  const [notes, setNotes] = useState('');

  if (!isOpen || !record) return null;

  const handleApprove = () => {
    onUpdateApproval(record.id, 'approved', approverName);
    onClose();
  };

  const handleReject = () => {
    onUpdateApproval(record.id, 'rejected', approverName);
    onClose();
  };

  const handleSubmitForReview = () => {
    onUpdateApproval(record.id, 'pending');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-indigo-400">
                  #{record.recordNumber}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {table.nameKu} • بڕیاردان و ڕەزامەندی
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                سیستەمی ڕەزامەندی فرەقۆناغی (Approval Workflow Engine)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTableToCsv(table, [record])}
              title="Download record as CSV"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={() => exportTableToPdf(table, [record], currentLang)}
              title="Download record as PDF Report"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Approval Status Banner */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">دۆخی ئێستا:</span>
            {record.approvalStatus === 'approved' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" />
                {t.approvedBadge} لەلایەن: {record.approvedBy || 'بەڕێوەبەر'} ({record.approvalDate || '2026-09-24'})
              </span>
            )}
            {record.approvalStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                {t.pendingBadge} بۆ بڕیاردان
              </span>
            )}
            {record.approvalStatus === 'draft' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700/40 text-slate-300 border border-slate-600/30">
                {t.draftBadge}
              </span>
            )}
            {record.approvalStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <XCircle className="w-3.5 h-3.5" />
                {t.rejectedBadge}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            دروستکراوە: {record.createdAt}
          </div>
        </div>

        {/* Main Fields Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          {table.fields.map((f) => (
            <div key={f.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 mb-1">
                {currentLang === 'ku' ? f.nameKu : f.name}
              </div>
              <div className="text-sm font-bold text-white truncate">
                {f.type === 'currency' && typeof record[f.id] === 'number' 
                  ? `$${Number(record[f.id]).toLocaleString()}`
                  : record[f.id] !== undefined 
                  ? String(record[f.id]) 
                  : '-'}
              </div>
            </div>
          ))}
        </div>

        {/* Sub-table Line items if exists */}
        {record.subItems && record.subItems.length > 0 && (
          <div className="mt-5 space-y-2">
            <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{table.subTableTitleKu || 'لیستەی بابەتەکانی خشتەی ژێرەوە (Sub-Table Line Items)'}</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="p-2.5">بابەت / کەرەستە</th>
                    <th className="p-2.5 text-center">دانە (Qty)</th>
                    <th className="p-2.5">نرخی یەکە</th>
                    <th className="p-2.5 text-left">کۆی گشتی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {record.subItems.map((sub) => (
                    <tr key={sub.id}>
                      <td className="p-2.5 text-white font-medium">{sub.item}</td>
                      <td className="p-2.5 text-center font-mono text-slate-300">{sub.quantity}</td>
                      <td className="p-2.5 text-slate-400">${sub.unitPrice.toLocaleString()}</td>
                      <td className="p-2.5 text-left font-mono font-bold text-emerald-400">${sub.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approval Form Action Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              ناوی بڕیاردەر / بەڕێوەبەر:
            </span>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {record.approvalStatus === 'draft' && (
              <button
                onClick={handleSubmitForReview}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t.submitApproval}</span>
              </button>
            )}

            <button
              onClick={handleReject}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/30 border border-rose-500/30 hover:bg-rose-900/40 transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{t.reject}</span>
            </button>

            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.approve}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
